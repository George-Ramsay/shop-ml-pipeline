import { MockScoringPanel } from "@/components/mock-scoring-panel";
import { PageFrame } from "@/components/page-frame";
import { PriorityQueueTable } from "@/components/priority-queue-table";
import { getPriorityQueueRows } from "@/lib/mock-data";

export default function PriorityQueuePage() {
  const rows = getPriorityQueueRows();

  return (
    <PageFrame
      eyebrow="Late Delivery Priority Queue"
      title="Warehouse late-delivery queue"
      description="The warehouse route now renders ranked mock orders so the scoring workflow can be demoed before the real pipeline is connected."
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
              These rows are derived from shared mock order and shipment data so
              the queue page has a believable end-to-end state before ML
              integration.
            </p>
          </div>

          <PriorityQueueTable rows={rows} />
        </div>

        <MockScoringPanel />
      </div>
    </PageFrame>
  );
}
