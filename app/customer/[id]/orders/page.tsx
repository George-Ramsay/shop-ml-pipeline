import { notFound } from "next/navigation";

import { OrdersTable } from "@/components/orders-table";
import { PageFrame } from "@/components/page-frame";
import { getCustomerById, getOrdersByCustomerId } from "@/lib/mock-data";

type OrderHistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderHistoryPage({
  params,
}: OrderHistoryPageProps) {
  const { id } = await params;
  const customerId = Number(id);
  const customer = getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  const orders = getOrdersByCustomerId(customerId);

  return (
    <PageFrame
      eyebrow="Order History"
      title={`${customer.fullName} order history`}
      description="This page now renders a customer-scoped order table with mock records. It mirrors the shape we will later read from Supabase so the UI can be demoed and reviewed now."
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
            The table below is driven by shared order types and mock helpers, so
            the later database swap should stay mostly inside the data layer.
          </p>
        </div>

        <OrdersTable orders={orders} />
      </div>
    </PageFrame>
  );
}
