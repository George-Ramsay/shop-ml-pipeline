import { PageFrame } from "@/components/page-frame";

type OrderHistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderHistoryPage({
  params,
}: OrderHistoryPageProps) {
  const { id } = await params;

  return (
    <PageFrame
      eyebrow="Order History"
      title={`Order history route for ${id}`}
      description="This page confirms the order-history route is wired correctly. It will later render a customer-scoped order table once mock records and shared table components are added."
      actions={[
        {
          href: `/customer/${id}`,
          label: "Back to dashboard",
        },
        {
          href: `/customer/${id}/new-order`,
          label: "Create new order",
        },
      ]}
    >
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6">
        <p className="text-sm font-semibold text-slate-950">
          Placeholder order list
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          The route is active and ready for the shared order table. In the next
          steps we will define the order shape, seed mock records, and show a
          customer-specific list here.
        </p>
      </div>
    </PageFrame>
  );
}
