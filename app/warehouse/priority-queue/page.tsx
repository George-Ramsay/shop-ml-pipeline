import { PageFrame } from "@/components/page-frame";

export default function PriorityQueuePage() {
  return (
    <PageFrame
      eyebrow="Late Delivery Priority Queue"
      title="Warehouse queue route"
      description="This route is ready for the warehouse workflow. The real queue table and scoring interactions come later, but the dedicated screen and navigation are now in place."
      actions={[
        {
          href: "/",
          label: "Back to customer selection",
        },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-semibold text-slate-950">
            Queue table placeholder
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            This panel will show the top late-delivery-risk orders once the
            queue row model and mock scoring data are in place.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-950">Run scoring</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Run Scoring
          </button>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The button is visible now, and later steps will connect it to a mock
            scoring action before real ML integration.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
