import { notFound } from "next/navigation";

import { PageFrame } from "@/components/page-frame";
import { SummaryCard } from "@/components/summary-card";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getCustomerDashboardData } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

type CustomerDashboardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDashboardPage({
  params,
}: CustomerDashboardPageProps) {
  const { id } = await params;
  const customerId = Number(id);
  const data = await getCustomerDashboardData(customerId);

  if (!data) {
    notFound();
  }

  const { customer, latestOrder, orderCount, lifetimeSpend } = data;

  return (
    <PageFrame
      eyebrow="Customer Dashboard"
      title={customer.fullName}
      description={`${customer.email} | ${customer.city}, ${customer.state}. This dashboard now reads the live customer and order records stored in Supabase.`}
      actions={[
        {
          href: `/customer/${customerId}/orders`,
          label: "View order history",
        },
        {
          href: `/customer/${customerId}/new-order`,
          label: "Create new order",
        },
      ]}
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <SummaryCard
          label="Customer segment"
          value={customer.customerSegment ?? "standard"}
          detail={`Loyalty tier: ${customer.loyaltyTier ?? "none"}`}
        />
        <SummaryCard
          label="Orders placed"
          value={String(orderCount)}
          detail="Counted from the current deployed order history."
        />
        <SummaryCard
          label="Lifetime spend"
          value={formatCurrency(lifetimeSpend)}
          detail="Calculated from the orders currently stored for this customer."
        />
        <SummaryCard
          label="Latest order"
          value={latestOrder ? `#${latestOrder.orderId}` : "None"}
          detail={
            latestOrder
              ? formatDateTime(latestOrder.orderDatetime)
              : "No order activity yet."
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-950">Customer profile</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Location</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {customer.city}, {customer.state} {customer.zipCode}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Joined</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {formatDateTime(customer.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Birthdate</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {customer.birthdate}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Status</dt>
              <dd className="mt-1 font-medium text-slate-950">
                {customer.isActive ? "Active" : "Inactive"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-950">Recent order note</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {latestOrder
              ? `Most recent order total was ${formatCurrency(latestOrder.orderTotal)} using ${latestOrder.paymentMethod}.`
              : "Once orders are available, this panel can show the latest activity summary."}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The layout is now powered by Supabase-backed reads, so what you see
            here reflects the deployed dataset instead of seeded placeholders.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
