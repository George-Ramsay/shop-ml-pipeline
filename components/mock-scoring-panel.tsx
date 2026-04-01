"use client";

import { useState } from "react";

export function MockScoringPanel() {
  const [lastRun, setLastRun] = useState<string | null>(null);

  function handleRunScoring() {
    setLastRun(
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
      <p className="text-sm font-semibold text-slate-950">Run scoring</p>
      <button
        type="button"
        onClick={handleRunScoring}
        className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Run Scoring
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        This mock action simulates refreshing the queue while the real ML hook is
        still under construction.
      </p>
      <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
        {lastRun
          ? `Queue refreshed at ${lastRun}.`
          : "No refresh has been triggered in this browser session yet."}
      </div>
    </div>
  );
}
