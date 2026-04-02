import { CustomerSelectorTable } from "@/components/customer-selector-table";
import { PageFrame } from "@/components/page-frame";
import { getCustomersWithOrderCounts } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const customers = await getCustomersWithOrderCounts();

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

  return (
    <PageFrame title="Customer Portal">
      <CustomerSelectorTable customers={rows} />
    </PageFrame>
  );
}
