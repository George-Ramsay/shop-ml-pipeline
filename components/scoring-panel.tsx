"use client";

import { useState } from "react";

export function ScoringPanel() {
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
      <p className="text-sm font-semibold text-slate-950">Queue refresh</p>
      <button
        type="button"
        onClick={handleRefresh}
        className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Refresh Queue View
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        The queue below is loaded from Supabase. Use this control to mark when
        you last reviewed the live ranking while the scoring trigger is still
        being finalized.
      </p>
      <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
        {lastRefresh
          ? `Queue view refreshed at ${lastRefresh}.`
          : "No manual refresh has been recorded in this browser session yet."}
      </div>
    </div>
  );
}
