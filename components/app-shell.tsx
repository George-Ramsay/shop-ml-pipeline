import Link from "next/link";
import type { ReactNode } from "react";

import { DEMO_CUSTOMER_ID } from "@/lib/demo";

const navItems = [
  { href: "/", label: "Select Customer" },
  { href: `/customer/${DEMO_CUSTOMER_ID}`, label: "Customer Dashboard" },
  { href: `/customer/${DEMO_CUSTOMER_ID}/new-order`, label: "New Order" },
  { href: `/customer/${DEMO_CUSTOMER_ID}/orders`, label: "Order History" },
  { href: "/warehouse/priority-queue", label: "Priority Queue" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Shop ML Pipeline
              </p>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Operations workspace
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  Phase 1 routing shell for the customer workflow, order flow,
                  and warehouse queue.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Demo customer route uses <code>{DEMO_CUSTOMER_ID}</code> until
              mock data is wired in.
            </div>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-wrap gap-3 text-sm font-medium text-slate-700"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-cyan-300 hover:text-cyan-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
