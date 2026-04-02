import { PageFrame } from "@/components/page-frame";
import { PriorityQueueTable } from "@/components/priority-queue-table";
import { ScoringPanel } from "@/components/scoring-panel";
import { getPriorityQueueRows } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

function latestFraudBatchIso(
  rows: { fraudScoredAt: string | null }[],
): string | null {
  return rows.reduce<string | null>((best, row) => {
    const t = row.fraudScoredAt;
    if (!t) return best;
    if (!best || t > best) return t;
    return best;
  }, null);
}

export default async function PriorityQueuePage() {
  const rows = await getPriorityQueueRows();
  const latestIso = latestFraudBatchIso(rows);
  const latestFraudBatchLabel = latestIso
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(latestIso))
    : null;

  return (
    <PageFrame
      eyebrow="Warehouse operations"
      title="Priority queue — fraud & late delivery"
      description="Review model scores, record human fraud labels (same control as order history), and see late-delivery risk. Live Supabase data."
      actions={[
        {
          href: "/",
          label: "Back to customer selection",
        },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">
              {rows.length} ranked orders (by order risk)
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              <strong>Pred. fraud</strong> and <strong>Order risk</strong> come from the
              scoring pipeline. <strong>Human review</strong> writes{" "}
              <code>actual_fraud</code> (identical to the order history page).{" "}
              <strong>Late delivery</strong> blends shipment timing with order risk.
            </p>
          </div>

          <PriorityQueueTable rows={rows} />
        </div>

        <ScoringPanel
          latestFraudBatchLabel={latestFraudBatchLabel}
          orderCount={rows.length}
        />
      </div>
    </PageFrame>
  );
}
