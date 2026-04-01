import { PageFrame } from "@/components/page-frame";

type NewOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewOrderPage({ params }: NewOrderPageProps) {
  const { id } = await params;

  return (
    <PageFrame
      eyebrow="New Order"
      title={`New order route for ${id}`}
      description="This route establishes the path for order creation before the form exists. It will later host the shared new-order form and submission feedback."
      actions={[
        {
          href: `/customer/${id}`,
          label: "Back to dashboard",
        },
        {
          href: `/customer/${id}/orders`,
          label: "View order history",
        },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6">
          <p className="text-sm font-semibold text-slate-950">Form area</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Reserved for item details, quantities, shipping fields, and submit
            actions.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-950">
            Context panel
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We can use this space later for customer context, validation notes,
            or order summary feedback.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
