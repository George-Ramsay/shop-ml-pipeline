import Link from "next/link";
import type { ReactNode } from "react";

import { DEMO_CUSTOMER_ID } from "@/lib/demo";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const customerHref = `/customer/${DEMO_CUSTOMER_ID}`;
  const navItems = [
    { href: "/", label: "Select Customer" },
    { href: customerHref, label: "Customer Dashboard" },
    { href: `${customerHref}/new-order`, label: "New Order" },
    { href: `${customerHref}/orders`, label: "Order History" },
    { href: "/warehouse/priority-queue", label: "Priority queue (fraud)" },
  ];

  const hasPublicSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Shop ML Pipeline
              </p>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Operations workspace
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  Customer and order workflows with demo routes and Supabase
                  configuration status.
                </p>
              </div>
            </div>

            <nav
              aria-label="Primary"
              className="flex flex-wrap gap-2 text-sm font-medium text-slate-700"
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
        </div>
      </header>

      <section aria-label="Live notifications" className="border-b border-slate-200/80 bg-white/65">
        <div className="mx-auto w-full max-w-7xl px-6 py-3 lg:px-8">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p>
                Demo customer route uses <code>{DEMO_CUSTOMER_ID}</code> and is ready
                for mock data walkthroughs.
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-800">
                <span className="size-1.5 animate-pulse rounded-full bg-cyan-500" aria-hidden="true" />
                Live
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p>
                {hasPublicSupabaseEnv
                  ? "Supabase public env detected."
                  : "Supabase public env missing."}{" "}
                {hasServiceRoleKey
                  ? "Server-side secret key is also available."
                  : "Server-side secret key is not configured."}
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                Live
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
