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
		id: "customer-1001",
		fullName: "Patricia Diallo",
		email: "patriciadiallo0@example.com",
		tier: "gold",
		segment: "premium",
		city: "Denver",
		state: "CO",
		zipCode: "80205",
		orderCount: 2,
	},
	{
		id: "customer-1002",
		fullName: "Marcus Bennett",
		email: "marcus.bennett@example.com",
		tier: "silver",
		segment: "standard",
		city: "Phoenix",
		state: "AZ",
		zipCode: "85004",
		orderCount: 2,
	},
	{
		id: "customer-1003",
		fullName: "Avery Nguyen",
		email: "avery.nguyen@example.com",
		tier: "none",
		segment: "budget",
		city: "Seattle",
		state: "WA",
		zipCode: "98104",
		orderCount: 2,
	},
	{
		id: "customer-1004",
		fullName: "Lena Ibrahim",
		email: "lena.ibrahim@example.com",
		tier: "gold",
		segment: "premium",
		city: "Austin",
		state: "TX",
		zipCode: "78701",
		orderCount: 5,
	},
	{
		id: "customer-1005",
		fullName: "Noah Park",
		email: "noah.park@example.com",
		tier: "silver",
		segment: "standard",
		city: "Portland",
		state: "OR",
		zipCode: "97205",
		orderCount: 3,
	},
	{
		id: "customer-1006",
		fullName: "Elena Rossi",
		email: "elena.rossi@example.com",
		tier: "none",
		segment: "budget",
		city: "Miami",
		state: "FL",
		zipCode: "33131",
		orderCount: 1,
	},
];

export const DEMO_CUSTOMER_ID = DEMO_CUSTOMERS[0].id;
