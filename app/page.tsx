import Link from "next/link";

import { PageFrame } from "@/components/page-frame";
import { DEMO_CUSTOMER_ID } from "@/lib/demo";
import { getCustomers, getOrderCountByCustomer } from "@/lib/mock-data";

export default function Home() {
  const customers = getCustomers();

  return (
    <PageFrame
      eyebrow="Select Customer"
      title="Choose a customer to start the workflow"
      description="The live app now has mock customer records wired in so the dashboard, order history, and new-order flow can be demoed end to end before Supabase integration."
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
      <div className="grid gap-4 lg:grid-cols-3">
        {customers.map((customer) => (
          <Link
            key={customer.customerId}
            href={`/customer/${customer.customerId}`}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-cyan-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">
                  {customer.fullName}
                </p>
                <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                {customer.loyaltyTier ?? "none"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Segment
                </p>
                <p className="mt-1 font-medium capitalize text-slate-950">
                  {customer.customerSegment ?? "standard"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Orders
                </p>
                <p className="mt-1 font-medium text-slate-950">
                  {getOrderCountByCustomer(customer.customerId)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {customer.city}, {customer.state} {customer.zipCode}
            </p>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}
