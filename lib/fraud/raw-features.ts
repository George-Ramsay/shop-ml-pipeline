/**
 * Feature engineering aligned with `FraudRiskRegression_Production.ipynb` / CleanShopDB merge.
 */

export type MergedOrderRow = {
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
  birthdate: string;
  created_at: string;
  city: string;
  state: string;
  zip_code: string | null;
  customer_segment: string;
  loyalty_tier: string;
  gender: string;
  is_active: boolean;
  ship_datetime: string | null;
  carrier: string | null;
  shipping_method: string | null;
  distance_band: string | null;
  promised_days: number | null;
  actual_days: number | null;
  late_delivery: boolean | null;
  num_items: number;
  avg_price: number;
  total_value: number;
  avg_weight: number;
  customer_order_count: number;
};

function zipToNum(z: string | null | undefined): number {
  if (z == null || z === "") {
    return Number.NaN;
  }
  const digits = String(z).replace(/\D/g, "").slice(0, 8);
  if (!digits) {
    return Number.NaN;
  }
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : Number.NaN;
}

function addTimeParts(
  d: Date,
  prefix: string,
  out: Record<string, number | string | boolean>,
) {
  out[`${prefix}_year`] = d.getUTCFullYear();
  out[`${prefix}_month`] = d.getUTCMonth() + 1;
  out[`${prefix}_day`] = d.getUTCDate();
  out[`${prefix}_hour`] = d.getUTCHours();
  out[`${prefix}_minute`] = d.getUTCMinutes();
  out[`${prefix}_second`] = d.getUTCSeconds();
}

/**
 * Build raw feature map (before standardization / one-hot) for one merged order row.
 */
export function buildRawFeatureRow(row: MergedOrderRow): Record<string, number | string | boolean> {
  const orderDate = new Date(row.order_datetime);
  const shipDate = row.ship_datetime ? new Date(row.ship_datetime) : null;
  const birth = new Date(row.birthdate);
  const created = new Date(row.created_at);

  const orderMs = orderDate.getTime();
  const shipMs = shipDate ? shipDate.getTime() : Number.NaN;
  const delivery_days = Number.isFinite(shipMs)
    ? Math.floor((shipMs - orderMs) / 86_400_000)
    : Number.NaN;

  const ageDays = (orderMs - birth.getTime()) / 86_400_000;
  const customer_age = Number.isFinite(ageDays) ? Math.floor(ageDays / 365) : Number.NaN;

  const orderHour = orderDate.getUTCHours() + orderDate.getUTCMinutes() / 60 + orderDate.getUTCSeconds() / 3600;
  const orderDow = (orderDate.getUTCDay() + 6) % 7;

  const out: Record<string, number | string | boolean> = {
    actual_days: row.actual_days ?? Number.NaN,
    avg_price: row.avg_price,
    avg_weight: row.avg_weight,
    billing_zip: zipToNum(row.billing_zip),
    customer_age,
    delivery_days,
    num_items: row.num_items,
    order_subtotal: row.order_subtotal,
    order_total: row.order_total,
    promised_days: row.promised_days ?? Number.NaN,
    promo_used: row.promo_used,
    shipping_fee: row.shipping_fee,
    tax_amount: row.tax_amount,
    total_value: row.total_value,
    shipping_zip: zipToNum(row.shipping_zip),
    zip_code: zipToNum(row.zip_code),
    late_delivery: row.late_delivery ?? false,
    is_active: row.is_active,
    customer_order_count: row.customer_order_count,
    order_dow: orderDow,
    order_is_weekend: orderDow >= 5 ? 1 : 0,
    order_is_night: orderHour >= 22 || orderHour < 6 ? 1 : 0,
    order_hour_sin: Math.sin((2 * Math.PI * orderHour) / 24),
    order_hour_cos: Math.cos((2 * Math.PI * orderHour) / 24),
    carrier: row.carrier ?? "",
    city: row.city,
    customer_segment: row.customer_segment,
    device_type: row.device_type,
    distance_band: row.distance_band ?? "",
    gender: row.gender,
    ip_country: row.ip_country,
    loyalty_tier: row.loyalty_tier,
    payment_method: row.payment_method,
    promo_code: row.promo_code == null || row.promo_code === "" ? "__nan__" : row.promo_code,
    shipping_method: row.shipping_method ?? "",
    shipping_state: row.shipping_state ?? "",
    state: row.state,
  };

  addTimeParts(orderDate, "order_datetime", out);
  addTimeParts(orderDate, "order_date", out);
  if (shipDate && Number.isFinite(shipMs)) {
    addTimeParts(shipDate, "ship_datetime", out);
    addTimeParts(shipDate, "ship_date", out);
  } else {
    for (const prefix of ["ship_datetime", "ship_date"] as const) {
      out[`${prefix}_year`] = Number.NaN;
      out[`${prefix}_month`] = Number.NaN;
      out[`${prefix}_day`] = Number.NaN;
      out[`${prefix}_hour`] = Number.NaN;
      out[`${prefix}_minute`] = Number.NaN;
      out[`${prefix}_second`] = Number.NaN;
    }
  }

  addTimeParts(birth, "birthdate", out);
  addTimeParts(created, "created_at", out);

  return out;
}
