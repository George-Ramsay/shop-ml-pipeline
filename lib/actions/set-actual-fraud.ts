"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function isMissingFraudReviewColumnsError(message: string) {
  if (!message.includes("does not exist")) {
    return false;
  }
  return message.includes("actual_fraud") || message.includes("fraud_reviewed_at");
}

/**
 * Save human fraud label. Same data whether updated from order history or priority queue.
 * `value`: true = fraud, false = not fraud, null = clear review.
 */
export async function setOrderActualFraud(
  orderId: number,
  customerId: number,
  value: boolean | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createSupabaseServerClient();

  const { data: row, error: fetchError } = await supabase
    .from("orders")
    .select("customer_id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message };
  }
  if (!row || Number(row.customer_id) !== customerId) {
    return { ok: false, error: "Order not found for this customer." };
  }

  const reviewedAt = value === null ? null : new Date().toISOString();

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      actual_fraud: value,
      fraud_reviewed_at: reviewedAt,
    })
    .eq("order_id", orderId);

  if (updateError) {
    if (isMissingFraudReviewColumnsError(updateError.message)) {
      return {
        ok: false,
        error:
          "Human review is unavailable until the database migration adds orders.actual_fraud and orders.fraud_reviewed_at.",
      };
    }
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/warehouse/priority-queue");
  revalidatePath(`/customer/${customerId}/orders`);

  return { ok: true };
}
