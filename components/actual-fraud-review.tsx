"use client";

import { useState, useTransition } from "react";

import { setOrderActualFraud } from "@/lib/actions/set-actual-fraud";

type ActualFraudReviewProps = {
  orderId: number;
  customerId: number;
  initialActualFraud: boolean | null;
};

/**
 * Shared human label control — same UI on order history and warehouse queue.
 * Values: not reviewed | not fraud | fraud.
 */
export function ActualFraudReview({
  orderId,
  customerId,
  initialActualFraud,
}: ActualFraudReviewProps) {
  const [value, setValue] = useState<string>(
    initialActualFraud === null ? "" : initialActualFraud ? "true" : "false",
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function commit(next: string) {
    const prev = value;
    setValue(next);
    setError(null);
    const parsed: boolean | null = next === "" ? null : next === "true";
    startTransition(async () => {
      const res = await setOrderActualFraud(orderId, customerId, parsed);
      if (!res.ok) {
        setError(res.error);
        setValue(prev);
      }
    });
  }

  return (
    <div className="flex min-w-[9rem] flex-col gap-1">
      <label className="sr-only" htmlFor={`actual-fraud-${orderId}`}>
        Human review — actually fraud
      </label>
      <select
        id={`actual-fraud-${orderId}`}
        value={value}
        disabled={pending}
        onChange={(e) => commit(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
      >
        <option value="">Not reviewed</option>
        <option value="false">Not fraud</option>
        <option value="true">Fraud</option>
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
