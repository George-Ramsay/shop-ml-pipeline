"use client";

import { useState } from "react";

type ScoringPanelProps = {
  /** Most recent `fraud_scored_at` across loaded queue rows (from batch pipeline). */
  latestFraudBatchLabel: string | null;
  orderCount: number;
};

export function ScoringPanel({
  latestFraudBatchLabel,
  orderCount,
}: ScoringPanelProps) {
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  function handleRefresh() {
    setLastRefresh(
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date()),
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold text-slate-950">Fraud pipeline</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        <strong>Pred. fraud</strong> and <strong>Order risk</strong> come from the scoring
        job (<code className="text-xs">risk_score</code>, <code className="text-xs">is_fraud</code>
        ). <strong>Human review</strong> saves <code className="text-xs">actual_fraud</code> in
        Supabase—the same control exists on customer order history. Nightly retraining should
        use those labels (see <code className="text-xs">lib/fraud/training-target.ts</code>
        ) before re-running inference.
      </p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-950">Showing {orderCount} orders</span>{" "}
          (highest order risk first).
        </p>
        <p className="mt-2 text-slate-600">
          Last fraud batch timestamp in this snapshot:{" "}
          {latestFraudBatchLabel ? (
            <span className="font-medium text-slate-900">{latestFraudBatchLabel}</span>
          ) : (
            <span className="text-amber-800">Not scored yet (run the batch job)</span>
          )}
        </p>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-950">Queue view</p>
      <button
        type="button"
        onClick={handleRefresh}
        className="mt-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Mark review time
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Use this after you refresh the browser to note when you reviewed the queue
        in this session.
      </p>
      <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
        {lastRefresh
          ? `Marked reviewed at ${lastRefresh}.`
          : "No review time recorded in this browser session yet."}
      </div>
    </div>
  );
}
