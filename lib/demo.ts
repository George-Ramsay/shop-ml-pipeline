/**
 * Home page picker. `id` must match seeded `customer_id` in Supabase (see load migration).
 */
export type DemoCustomer = {
  id: string;
  fullName: string;
  email: string;
  tier: "gold" | "silver" | "none";
  segment: "premium" | "standard" | "budget";
  city: string;
  state: string;
  zipCode: string;
  orderCount: number;
};

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: "1",
    fullName: "Patricia Diallo",
    email: "patriciadiallo0@example.com",
    tier: "silver",
    segment: "standard",
    city: "Clayton",
    state: "CO",
    zipCode: "28289",
    orderCount: 2,
  },
  {
    id: "2",
    fullName: "Juan Flores",
    email: "juanflores1@example.com",
    tier: "none",
    segment: "budget",
    city: "Hudson",
    state: "CO",
    zipCode: "88907",
    orderCount: 2,
  },
  {
    id: "3",
    fullName: "Mary González",
    email: "marygonzález2@example.com",
    tier: "gold",
    segment: "budget",
    city: "Oxford",
    state: "OH",
    zipCode: "46421",
    orderCount: 2,
  },
  {
    id: "4",
    fullName: "Omar Fischer",
    email: "omarfischer3@example.com",
    tier: "gold",
    segment: "standard",
    city: "Riverton",
    state: "NC",
    zipCode: "70217",
    orderCount: 5,
  },
  {
    id: "5",
    fullName: "Salma Sullivan",
    email: "salmasullivan4@example.com",
    tier: "silver",
    segment: "standard",
    city: "Franklin",
    state: "AZ",
    zipCode: "16006",
    orderCount: 3,
  },
  {
    id: "6",
    fullName: "Rohan Suzuki",
    email: "rohansuzuki5@example.com",
    tier: "none",
    segment: "budget",
    city: "Milton",
    state: "IL",
    zipCode: "56566",
    orderCount: 1,
  },
];

export const DEMO_CUSTOMER_ID = DEMO_CUSTOMERS[0].id;
