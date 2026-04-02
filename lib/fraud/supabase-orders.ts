import type { SupabaseClient } from "@supabase/supabase-js";

import type { MergedOrderRow } from "@/lib/fraud/raw-features";

type OrderRow = {
  order_id: number;
  customer_id: number;
  order_datetime: string;
  billing_zip: string | null;
  shipping_zip: string | null;
  shipping_state: string | null;
  payment_method: string;
  device_type: string;
  ip_country: string;
  promo_used: boolean;
  promo_code: string | null;
  order_subtotal: number;
  shipping_fee: number;
  tax_amount: number;
  order_total: number;
  risk_score: number;
  actual_fraud: boolean | null;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export async function fetchMergedOrders(supabase: SupabaseClient): Promise<MergedOrderRow[]> {
  const pageSize = 1000;
  let from = 0;
  const orders: OrderRow[] = [];

  for (;;) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "order_id, customer_id, order_datetime, billing_zip, shipping_zip, shipping_state, payment_method, device_type, ip_country, promo_used, promo_code, order_subtotal, shipping_fee, tax_amount, order_total, risk_score, actual_fraud",
      )
      .order("order_id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`fetch orders: ${error.message}`);
    }
    const batch = (data ?? []) as OrderRow[];
    orders.push(...batch);
    if (batch.length < pageSize) {
      break;
    }
    from += pageSize;
  }

  const customerIds = [...new Set(orders.map((o) => o.customer_id))];
  const customersById = new Map<
    number,
    {
      birthdate: string;
      created_at: string;
      city: string;
      state: string;
      zip_code: string | null;
      customer_segment: string;
      loyalty_tier: string;
      gender: string;
      is_active: boolean;
    }
  >();

  for (const part of chunk(customerIds, 200)) {
    const { data, error } = await supabase
      .from("customers")
      .select(
        "customer_id, birthdate, created_at, city, state, zip_code, customer_segment, loyalty_tier, gender, is_active",
      )
      .in("customer_id", part);
    if (error) {
      throw new Error(`fetch customers: ${error.message}`);
    }
    for (const c of data ?? []) {
      const row = c as Record<string, unknown>;
      customersById.set(Number(row.customer_id), {
        birthdate: String(row.birthdate),
        created_at: String(row.created_at),
        city: String(row.city ?? ""),
        state: String(row.state ?? ""),
        zip_code: row.zip_code == null ? null : String(row.zip_code),
        customer_segment: String(row.customer_segment ?? ""),
        loyalty_tier: String(row.loyalty_tier ?? ""),
        gender: String(row.gender ?? ""),
        is_active: Boolean(row.is_active),
      });
    }
  }

  const orderIds = orders.map((o) => o.order_id);
  const shipmentsByOrder = new Map<
    number,
    {
      ship_datetime: string;
      carrier: string;
      shipping_method: string;
      distance_band: string;
      promised_days: number;
      actual_days: number;
      late_delivery: boolean;
    }
  >();

  for (const part of chunk(orderIds, 200)) {
    const { data, error } = await supabase
      .from("shipments")
      .select(
        "order_id, ship_datetime, carrier, shipping_method, distance_band, promised_days, actual_days, late_delivery",
      )
      .in("order_id", part);
    if (error) {
      throw new Error(`fetch shipments: ${error.message}`);
    }
    for (const s of data ?? []) {
      const row = s as Record<string, unknown>;
      shipmentsByOrder.set(Number(row.order_id), {
        ship_datetime: String(row.ship_datetime),
        carrier: String(row.carrier ?? ""),
        shipping_method: String(row.shipping_method ?? ""),
        distance_band: String(row.distance_band ?? ""),
        promised_days: Number(row.promised_days),
        actual_days: Number(row.actual_days),
        late_delivery: Boolean(row.late_delivery),
      });
    }
  }

  const aggByOrder = new Map<
    number,
    { num_items: number; avg_price: number; total_value: number; avg_weight: number }
  >();

  for (const part of chunk(orderIds, 100)) {
    const { data, error } = await supabase
      .from("order_items")
      .select("order_id, quantity, products(price, cost)")
      .in("order_id", part);
    if (error) {
      throw new Error(`fetch order_items: ${error.message}`);
    }

    const temp = new Map<number, { qty: number[]; prices: number[]; costs: number[] }>();
    for (const r of data ?? []) {
      const row = r as {
        order_id: number;
        quantity: number;
        products: { price: number; cost: number } | { price: number; cost: number }[] | null;
      };
      const oid = Number(row.order_id);
      const pr = row.products;
      const prod = Array.isArray(pr) ? pr[0] : pr;
      const price = prod != null ? Number(prod.price) : 0;
      const cost = prod != null ? Number(prod.cost) : 0;
      const q = Number(row.quantity) || 0;
      let slot = temp.get(oid);
      if (!slot) {
        slot = { qty: [], prices: [], costs: [] };
        temp.set(oid, slot);
      }
      slot.qty.push(q);
      slot.prices.push(price);
      slot.costs.push(cost);
    }

    for (const [oid, slot] of temp) {
      const num_items = slot.qty.reduce((a, b) => a + b, 0);
      const nP = slot.prices.length;
      const avg_price = nP ? slot.prices.reduce((a, b) => a + b, 0) / nP : 0;
      const total_value = slot.prices.reduce((a, b) => a + b, 0);
      const avg_weight = nP ? slot.costs.reduce((a, b) => a + b, 0) / nP : 0;
      aggByOrder.set(oid, { num_items, avg_price, total_value, avg_weight });
    }
  }

  const countByCustomer = new Map<number, number>();
  for (const o of orders) {
    countByCustomer.set(o.customer_id, (countByCustomer.get(o.customer_id) ?? 0) + 1);
  }

  const merged: MergedOrderRow[] = [];
  for (const o of orders) {
    const c = customersById.get(o.customer_id);
    if (!c) {
      continue;
    }
    const sh = shipmentsByOrder.get(o.order_id);
    const agg = aggByOrder.get(o.order_id) ?? {
      num_items: 0,
      avg_price: 0,
      total_value: 0,
      avg_weight: 0,
    };

    merged.push({
      order_id: o.order_id,
      customer_id: o.customer_id,
      order_datetime: o.order_datetime,
      billing_zip: o.billing_zip,
      shipping_zip: o.shipping_zip,
      shipping_state: o.shipping_state,
      payment_method: o.payment_method,
      device_type: o.device_type,
      ip_country: o.ip_country,
      promo_used: o.promo_used,
      promo_code: o.promo_code,
      order_subtotal: Number(o.order_subtotal),
      shipping_fee: Number(o.shipping_fee),
      tax_amount: Number(o.tax_amount),
      order_total: Number(o.order_total),
      risk_score: Number(o.risk_score),
      actual_fraud: o.actual_fraud,
      birthdate: c.birthdate,
      created_at: c.created_at,
      city: c.city,
      state: c.state,
      zip_code: c.zip_code,
      customer_segment: c.customer_segment,
      loyalty_tier: c.loyalty_tier,
      gender: c.gender,
      is_active: c.is_active,
      ship_datetime: sh?.ship_datetime ?? null,
      carrier: sh?.carrier ?? null,
      shipping_method: sh?.shipping_method ?? null,
      distance_band: sh?.distance_band ?? null,
      promised_days: sh?.promised_days ?? null,
      actual_days: sh?.actual_days ?? null,
      late_delivery: sh?.late_delivery ?? null,
      num_items: agg.num_items,
      avg_price: agg.avg_price,
      total_value: agg.total_value,
      avg_weight: agg.avg_weight,
      customer_order_count: countByCustomer.get(o.customer_id) ?? 1,
    });
  }

  return merged;
}
