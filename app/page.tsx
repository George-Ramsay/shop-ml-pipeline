import { CustomerSelectorTable } from "@/components/customer-selector-table";
import { PageFrame } from "@/components/page-frame";
import {
  getCustomerNavigationContext,
  getCustomersWithOrderCounts,
} from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [customers, navigation] = await Promise.all([
    getCustomersWithOrderCounts(),
    getCustomerNavigationContext(),
  ]);

  const rows = customers.map(({ customer, orderCount }) => ({
    id: customer.customerId.toString(),
    fullName: customer.fullName,
    email: customer.email,
    tier: customer.loyaltyTier ?? "none",
    segment: customer.customerSegment ?? "standard",
    city: customer.city ?? "",
    state: customer.state ?? "",
    zipCode: customer.zipCode ?? "",
    orderCount,
  }));

  const defaultCustomerId = navigation.defaultCustomerId ?? rows[0]?.id ?? null;

  return (
    <PageFrame
      eyebrow="Select Customer"
      title="Choose a customer to start the workflow"
      description="Use filters and search to find a customer quickly, then open their dashboard to continue the order flow."
      actions={[
        {
          href: defaultCustomerId ? `/customer/${defaultCustomerId}` : "/",
          label: "Open first customer dashboard",
        },
        {
          href: "/warehouse/priority-queue",
          label: "Open warehouse queue",
        },
      ]}
    >
      <CustomerSelectorTable customers={rows} />
    </PageFrame>
  );
}
