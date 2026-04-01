import Link from "next/link";

import { PageFrame } from "@/components/page-frame";
import { DEMO_CUSTOMER_ID } from "@/lib/demo";

export default function Home() {
  return (
    <PageFrame
      eyebrow="Select Customer"
      title="Customer entry point"
      description="This route is now the customer-selection landing page. The real selector and mock records come in the next steps, but the navigation path into the customer flow is ready."
      actions={[
        {
          href: `/customer/${DEMO_CUSTOMER_ID}`,
          label: "Open demo customer dashboard",
        },
        {
          href: "/warehouse/priority-queue",
          label: "Open warehouse queue",
        },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href={`/customer/${DEMO_CUSTOMER_ID}`}
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-300"
        >
          <p className="text-sm font-semibold text-slate-950">Demo customer</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the seeded placeholder route for the main customer workflow.
          </p>
        </Link>

        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-5">
          <p className="text-sm font-semibold text-slate-950">
            Customer picker coming next
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Step 3 will define the data shape, and Step 4 will populate the UI
            with mock customer options.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-5">
          <p className="text-sm font-semibold text-slate-950">
            Routing goal complete
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            From this screen, we can already reach the dashboard and the
            warehouse queue without broken links.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
