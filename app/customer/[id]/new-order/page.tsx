import { notFound } from "next/navigation";

import { PageFrame } from "@/components/page-frame";
import { formatCurrency } from "@/lib/format";
import { getNewOrderPageData } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

type NewOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewOrderPage({ params }: NewOrderPageProps) {
  const { id } = await params;
  const customerId = Number(id);
  const data = await getNewOrderPageData(customerId);

  if (!data) {
    notFound();
  }

  const { customer, draft } = data;
  const estimatedTotal =
    draft.orderSubtotal + draft.shippingFee + draft.taxAmount;

  return (
    <PageFrame
      eyebrow="New Order"
      title={`Create a new order for ${customer.fullName}`}
      description="This order-entry view is now seeded from live customer and recent-order data in Supabase, so the form context reflects the deployed dataset."
      actions={[
        {
          href: `/customer/${customerId}`,
          label: "Back to dashboard",
        },
        {
          href: `/customer/${customerId}/orders`,
          label: "View order history",
        },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-950">Order details</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              <span>Billing ZIP</span>
              <input
                readOnly
                defaultValue={draft.billingZip}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Shipping ZIP</span>
              <input
                readOnly
                defaultValue={draft.shippingZip}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Shipping state</span>
              <input
                readOnly
                defaultValue={draft.shippingState}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Promo code</span>
              <input
                readOnly
                defaultValue={draft.promoCode || "None"}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Payment method</span>
              <input
                readOnly
                defaultValue={draft.paymentMethod}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 capitalize text-slate-950 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Device type</span>
              <input
                readOnly
                defaultValue={draft.deviceType}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 capitalize text-slate-950 outline-none"
              />
            </label>
          </div>
          <div className="mt-5 rounded-[1.5rem] bg-cyan-50 px-5 py-4 text-sm leading-6 text-cyan-900">
            This is still a read-only form, but the defaults are derived from
            live customer and order records instead of hardcoded demo values.
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Order summary</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-950">
                  {formatCurrency(draft.orderSubtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping fee</dt>
                <dd className="font-medium text-slate-950">
                  {formatCurrency(draft.shippingFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Tax</dt>
                <dd className="font-medium text-slate-950">
                  {formatCurrency(draft.taxAmount)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
                <dt>Total</dt>
                <dd className="font-semibold text-slate-950">
                  {formatCurrency(estimatedTotal)}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white"
            >
              Submit Order
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-950">
              Customer context
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Shipping to {customer.city}, {customer.state}. This panel is a good
              future home for validation hints, fraud warnings, or order success
              feedback after submission.
            </p>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
