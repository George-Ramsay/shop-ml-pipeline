import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CustomerRecord,
  NewOrderDraft,
  OrderRecord,
  PriorityQueueRow,
} from "@/lib/types";

type CustomerRow = {
  customer_id: number;
  full_name: string;
  email: string;
  gender: string;
  birthdate: string;
  created_at: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  customer_segment: CustomerRecord["customerSegment"] | null;
  loyalty_tier: CustomerRecord["loyaltyTier"] | null;
  is_active: boolean;
};

type OrderRow = {
  order_id: number;
  customer_id: number;
  order_datetime: string;
  billing_zip: string | null;
  shipping_zip: string | null;
  shipping_state: string | null;
  payment_method: OrderRecord["paymentMethod"];
  device_type: OrderRecord["deviceType"];
  ip_country: string;
  promo_used: boolean;
  promo_code: string | null;
  order_subtotal: number | string;
  shipping_fee: number | string;
  tax_amount: number | string;
  order_total: number | string;
  risk_score: number | string;
  is_fraud: boolean;
  fraud_scored_at?: string | null;
  actual_fraud?: boolean | null;
  fraud_reviewed_at?: string | null;
};

type ShipmentRow = {
  order_id: number;
  carrier: PriorityQueueRow["carrier"];
  shipping_method: PriorityQueueRow["shippingMethod"];
  promised_days: number;
  actual_days: number;
  late_delivery: boolean;
};

/** Supabase error when migration `add_actual_fraud_review` has not been applied yet. */
function isMissingFraudReviewColumnsError(message: string) {
  if (!message.includes("does not exist")) {
    return false;
  }
  return message.includes("actual_fraud") || message.includes("fraud_reviewed_at");
}

const ORDER_SELECT_BASE =
  "order_id, customer_id, order_datetime, billing_zip, shipping_zip, shipping_state, payment_method, device_type, ip_country, promo_used, promo_code, order_subtotal, shipping_fee, tax_amount, order_total, risk_score, is_fraud";

const ORDER_SELECT_WITH_FRAUD_REVIEW = `${ORDER_SELECT_BASE}, actual_fraud, fraud_reviewed_at`;

const PRIORITY_QUEUE_SELECT_BASE = `${ORDER_SELECT_BASE}, customers!inner(customer_id, full_name), shipments(order_id, carrier, shipping_method, promised_days, actual_days, late_delivery)`;

const PRIORITY_QUEUE_SELECT_WITH_REVIEW = `${ORDER_SELECT_WITH_FRAUD_REVIEW}, customers!inner(customer_id, full_name), shipments(order_id, carrier, shipping_method, promised_days, actual_days, late_delivery)`;

async function selectOrdersForCustomer(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  customerId: number,
) {
  const primary = await supabase
    .from("orders")
    .select(ORDER_SELECT_WITH_FRAUD_REVIEW)
    .eq("customer_id", customerId)
    .order("order_datetime", { ascending: false });

  if (primary.error && isMissingFraudReviewColumnsError(primary.error.message)) {
    return supabase
      .from("orders")
      .select(ORDER_SELECT_BASE)
      .eq("customer_id", customerId)
      .order("order_datetime", { ascending: false });
  }

  return primary;
}

type QueueOrderRow = OrderRow & {
  customers:
    | {
        customer_id: number;
        full_name: string;
      }
    | {
        customer_id: number;
        full_name: string;
      }[]
    | null;
  shipments: ShipmentRow | ShipmentRow[] | null;
};

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function mapCustomer(row: CustomerRow): CustomerRecord {
  return {
    customerId: row.customer_id,
    fullName: row.full_name,
    email: row.email,
    gender: row.gender,
    birthdate: row.birthdate,
    createdAt: row.created_at,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    customerSegment: row.customer_segment,
    loyaltyTier: row.loyalty_tier,
    isActive: row.is_active,
  };
}

function mapOrder(row: OrderRow): OrderRecord {
  return {
    orderId: row.order_id,
    customerId: row.customer_id,
    orderDatetime: row.order_datetime,
    billingZip: row.billing_zip,
    shippingZip: row.shipping_zip,
    shippingState: row.shipping_state,
    paymentMethod: row.payment_method,
    deviceType: row.device_type,
    ipCountry: row.ip_country,
    promoUsed: row.promo_used,
    promoCode: row.promo_code,
    orderSubtotal: toNumber(row.order_subtotal),
    shippingFee: toNumber(row.shipping_fee),
    taxAmount: toNumber(row.tax_amount),
    orderTotal: toNumber(row.order_total),
    riskScore: toNumber(row.risk_score),
    isFraud: row.is_fraud,
    actualFraud:
      row.actual_fraud === null || row.actual_fraud === undefined
        ? null
        : Boolean(row.actual_fraud),
    fraudReviewedAt: row.fraud_reviewed_at ?? null,
  };
}

function riskToLabel(risk: number): PriorityQueueRow["lateDeliveryLabel"] {
  if (risk >= 0.75) {
    return "High";
  }

  if (risk >= 0.45) {
    return "Medium";
  }

  return "Low";
}

function buildDraftFromOrder(
  customerId: number,
  customer: CustomerRecord,
  latestOrder: OrderRecord | null,
): NewOrderDraft {
  return {
    customerId,
    billingZip: latestOrder?.billingZip ?? customer.zipCode ?? "",
    shippingZip: latestOrder?.shippingZip ?? customer.zipCode ?? "",
    shippingState: latestOrder?.shippingState ?? customer.state ?? "",
    paymentMethod: latestOrder?.paymentMethod ?? "card",
    deviceType: latestOrder?.deviceType ?? "desktop",
    ipCountry: latestOrder?.ipCountry ?? "US",
    promoCode: latestOrder?.promoCode ?? "",
    orderSubtotal: latestOrder?.orderSubtotal ?? 0,
    shippingFee: latestOrder?.shippingFee ?? 0,
    taxAmount: latestOrder?.taxAmount ?? 0,
  };
}

export async function getCustomerNavigationContext() {
  noStore();

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("customer_id")
    .order("customer_id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load default customer: ${error.message}`);
  }

  return {
    defaultCustomerId: data?.customer_id?.toString() ?? null,
  };
}

export async function getCustomersWithOrderCounts() {
  noStore();

  const supabase = createSupabaseServerClient();
  const [{ data: customerRows, error: customerError }, { data: orderRows, error: orderError }] =
    await Promise.all([
      supabase
        .from("customers")
        .select(
          "customer_id, full_name, email, gender, birthdate, created_at, city, state, zip_code, customer_segment, loyalty_tier, is_active",
        )
        .order("full_name", { ascending: true }),
      supabase.from("orders").select("customer_id"),
    ]);

  if (customerError) {
    throw new Error(`Failed to load customers: ${customerError.message}`);
  }

  if (orderError) {
    throw new Error(`Failed to load order counts: ${orderError.message}`);
  }

  const orderCountByCustomerId = new Map<number, number>();

  for (const order of orderRows ?? []) {
    const currentCount = orderCountByCustomerId.get(order.customer_id as number) ?? 0;
    orderCountByCustomerId.set(order.customer_id as number, currentCount + 1);
  }

  return (customerRows ?? []).map((row) => ({
    customer: mapCustomer(row as CustomerRow),
    orderCount: orderCountByCustomerId.get((row as CustomerRow).customer_id) ?? 0,
  }));
}

export async function getCustomerDashboardData(customerId: number) {
  noStore();

  const supabase = createSupabaseServerClient();
  const [{ data: customerRow, error: customerError }, orderResult] = await Promise.all([
    supabase
      .from("customers")
      .select(
        "customer_id, full_name, email, gender, birthdate, created_at, city, state, zip_code, customer_segment, loyalty_tier, is_active",
      )
      .eq("customer_id", customerId)
      .maybeSingle(),
    selectOrdersForCustomer(supabase, customerId),
  ]);

  const { data: orderRows, error: orderError } = orderResult;

  if (customerError) {
    throw new Error(`Failed to load customer ${customerId}: ${customerError.message}`);
  }

  if (orderError) {
    throw new Error(`Failed to load customer orders: ${orderError.message}`);
  }

  if (!customerRow) {
    return null;
  }

  const customer = mapCustomer(customerRow as CustomerRow);
  const orders = (orderRows ?? []).map((row) => mapOrder(row as OrderRow));

  return {
    customer,
    latestOrder: orders[0] ?? null,
    orderCount: orders.length,
    lifetimeSpend: orders.reduce((sum, order) => sum + order.orderTotal, 0),
  };
}

export async function getCustomerOrdersData(customerId: number) {
  noStore();

  const supabase = createSupabaseServerClient();
  const [{ data: customerRow, error: customerError }, orderResult] = await Promise.all([
    supabase
      .from("customers")
      .select(
        "customer_id, full_name, email, gender, birthdate, created_at, city, state, zip_code, customer_segment, loyalty_tier, is_active",
      )
      .eq("customer_id", customerId)
      .maybeSingle(),
    selectOrdersForCustomer(supabase, customerId),
  ]);

  const { data: orderRows, error: orderError } = orderResult;

  if (customerError) {
    throw new Error(`Failed to load customer ${customerId}: ${customerError.message}`);
  }

  if (orderError) {
    throw new Error(`Failed to load order history: ${orderError.message}`);
  }

  if (!customerRow) {
    return null;
  }

  return {
    customer: mapCustomer(customerRow as CustomerRow),
    orders: (orderRows ?? []).map((row) => mapOrder(row as OrderRow)),
  };
}

export async function getNewOrderPageData(customerId: number) {
  noStore();

  const dashboardData = await getCustomerDashboardData(customerId);

  if (!dashboardData) {
    return null;
  }

  return {
    customer: dashboardData.customer,
    draft: buildDraftFromOrder(
      customerId,
      dashboardData.customer,
      dashboardData.latestOrder,
    ),
  };
}

export async function getPriorityQueueRows(limit = 50) {
  noStore();

  const supabase = createSupabaseServerClient();

  const primary = await supabase
    .from("orders")
    .select(PRIORITY_QUEUE_SELECT_WITH_REVIEW)
    .order("risk_score", { ascending: false })
    .limit(limit);

  const res =
    primary.error && isMissingFraudReviewColumnsError(primary.error.message)
      ? await supabase
          .from("orders")
          .select(PRIORITY_QUEUE_SELECT_BASE)
          .order("risk_score", { ascending: false })
          .limit(limit)
      : primary;

  if (res.error) {
    throw new Error(`Failed to load priority queue: ${res.error.message}`);
  }

  return ((res.data ?? []) as QueueOrderRow[]).flatMap((row) => {
    const customer = Array.isArray(row.customers) ? row.customers[0] ?? null : row.customers;
    const shipment = Array.isArray(row.shipments)
      ? row.shipments[0] ?? null
      : row.shipments;

    if (!customer || !shipment) {
      return [];
    }

    const lateDeliveryRisk = Math.min(
      0.98,
      Number(
        (
          shipment.promised_days / Math.max(shipment.actual_days, 1) * 0.12 +
          toNumber(row.risk_score) / 100 * 0.55 +
          (shipment.late_delivery ? 0.28 : 0.08)
        ).toFixed(2),
      ),
    );

    return [
      {
        orderId: row.order_id,
        customerId: customer.customer_id,
        customerName: customer.full_name,
        orderDatetime: row.order_datetime,
        shippingState: row.shipping_state,
        carrier: shipment.carrier,
        shippingMethod: shipment.shipping_method,
        promisedDays: shipment.promised_days,
        actualDays: shipment.actual_days,
        riskScore: toNumber(row.risk_score),
        isFraud: row.is_fraud,
        actualFraud:
          row.actual_fraud === null || row.actual_fraud === undefined
            ? null
            : Boolean(row.actual_fraud),
        fraudReviewedAt: row.fraud_reviewed_at ?? null,
        fraudScoredAt: null,
        lateDeliveryRisk,
        lateDeliveryLabel: riskToLabel(lateDeliveryRisk),
      },
    ];
  });
}
