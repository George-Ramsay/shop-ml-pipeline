/**
 * `/customer/[id]` must match Supabase `customers.customer_id`.
 * Accepts `123` or legacy `customer-123`.
 */

export function parseCustomerRouteId(segment: string): number | null {
  const s = segment.trim();
  const legacy = /^customer-(\d+)$/i.exec(s);
  if (legacy) {
    const n = Number(legacy[1]);
    if (Number.isSafeInteger(n) && n > 0) return n;
    return null;
  }
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
  return n;
}
