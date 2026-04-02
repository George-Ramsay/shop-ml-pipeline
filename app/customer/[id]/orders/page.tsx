import { notFound } from "next/navigation";

import { OrdersTable } from "@/components/orders-table";
import { PageFrame } from "@/components/page-frame";
import { parseCustomerRouteId } from "@/lib/customer-route";
import { getCustomerOrdersData } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

type OrderHistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderHistoryPage({
  params,
}: OrderHistoryPageProps) {
  const { id } = await params;
  const customerId = parseCustomerRouteId(id);
  if (customerId === null) {
    notFound();
  }
  const data = await getCustomerOrdersData(customerId);

  if (!data) {
    notFound();
  }

  const { customer, orders } = data;

  return (
    <PageFrame
      eyebrow="Order History"
      title={`${customer.fullName} order history`}
      description="This table is loaded from Supabase and shows the current deployed order history for the selected customer."
      actions={[
        {
          href: `/customer/${customerId}`,
          label: "Back to dashboard",
        },
        {
          href: `/customer/${customerId}/new-order`,
          label: "Create new order",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">
            {orders.length} orders loaded
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The rows below come from the live <code>orders</code> table. Use{" "}
            <strong>Human review</strong> to record whether an order was actually
            fraud; nightly retraining can use those labels (same control as the
            warehouse queue).
          </p>
        </div>

        <OrdersTable orders={orders} customerId={customerId} />
      </div>
    </PageFrame>
  );
}
