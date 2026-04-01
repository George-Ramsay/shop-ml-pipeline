import { PageFrame } from "@/components/page-frame";

type CustomerDashboardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDashboardPage({
  params,
}: CustomerDashboardPageProps) {
  const { id } = await params;

  return (
    <PageFrame
      eyebrow="Customer Dashboard"
      title={`Dashboard route for ${id}`}
      description="This placeholder confirms the dashboard route exists and can receive a customer id. The next steps will replace this shell with real summaries, recent orders, and customer actions."
      actions={[
        {
          href: `/customer/${id}/orders`,
          label: "View order history",
        },
        {
          href: `/customer/${id}/new-order`,
          label: "Create new order",
        },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">Customer summary</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Reserved for status cards and recent order details.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">Order history</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This route will surface customer-specific orders once mock data is
            connected.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">Order creation</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The new-order flow is routed and ready for a form component.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
