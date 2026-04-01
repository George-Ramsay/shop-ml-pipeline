import { PageFrame } from "@/components/page-frame";
import { PriorityQueueTable } from "@/components/priority-queue-table";
import { ScoringPanel } from "@/components/scoring-panel";
import { getPriorityQueueRows } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export default async function PriorityQueuePage() {
  const rows = await getPriorityQueueRows();

  return (
    <PageFrame
      eyebrow="Late Delivery Priority Queue"
      title="Warehouse late-delivery queue"
      description="This warehouse queue is ranked from the deployed Supabase order and shipment data."
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
              {rows.length} ranked orders
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              These rows are computed from the live <code>orders</code>,{" "}
              <code>customers</code>, and <code>shipments</code> tables so the
              queue reflects the current deployed data.
            </p>
          </div>

          <PriorityQueueTable rows={rows} />
        </div>

        <ScoringPanel />
      </div>
    </PageFrame>
  );
}
