"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageFrame } from "@/components/page-frame";
import { DEMO_CUSTOMERS, DEMO_CUSTOMER_ID } from "@/lib/demo";

const tierClasses = {
  gold: "bg-amber-100 text-amber-900",
  silver: "bg-cyan-50 text-cyan-700",
  none: "bg-slate-100 text-slate-600",
} as const;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<"all" | "gold" | "silver" | "none">("all");
  const [selectedSegment, setSelectedSegment] = useState<
    "all" | "premium" | "standard" | "budget"
  >("all");

  const filteredCustomers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return DEMO_CUSTOMERS.filter((customer) => {
      const matchesSearchTerm =
        normalizedSearchTerm.length === 0 ||
        customer.fullName.toLowerCase().includes(normalizedSearchTerm) ||
        customer.email.toLowerCase().includes(normalizedSearchTerm) ||
        customer.city.toLowerCase().includes(normalizedSearchTerm) ||
        customer.state.toLowerCase().includes(normalizedSearchTerm);

      const matchesTier =
        selectedTier === "all" || customer.tier === selectedTier;

      const matchesSegment =
        selectedSegment === "all" || customer.segment === selectedSegment;

      return matchesSearchTerm && matchesTier && matchesSegment;
    });
  }, [searchTerm, selectedTier, selectedSegment]);

  return (
    <PageFrame
      title="Customer Portal"
      actions={[
        {
          href: `/customer/${DEMO_CUSTOMER_ID}`,
          label: "Open first customer dashboard",
        },
        {
          href: "/warehouse/priority-queue",
          label: "Open warehouse queue",
        },
      ]}
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Name, email, city, state"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tier
            </span>
            <select
              value={selectedTier}
              onChange={(event) =>
                setSelectedTier(
                  event.target.value as "all" | "gold" | "silver" | "none",
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All tiers</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="none">None</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Segment
            </span>
            <select
              value={selectedSegment}
              onChange={(event) =>
                setSelectedSegment(
                  event.target.value as
                    | "all"
                    | "premium"
                    | "standard"
                    | "budget",
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All segments</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="budget">Budget</option>
            </select>
          </label>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Tier</th>
                  <th className="px-4 py-3 font-semibold">Segment</th>
                  <th className="px-4 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="bg-white">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-950">{customer.fullName}</p>
                      <p className="text-slate-500">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tierClasses[customer.tier]}`}
                      >
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-700">{customer.segment}</td>
                    <td className="px-4 py-3 text-slate-700">{customer.orderCount}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {customer.city}, {customer.state} {customer.zipCode}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/customer/${customer.id}`}
                        className="inline-flex rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        Open dashboard
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 ? (
            <p className="border-t border-slate-200 px-4 py-6 text-sm text-slate-600">
              No customers match these filters. Try another search term or clear
              filters.
            </p>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}
