import Link from "next/link";
import type { ReactNode } from "react";

import { DismissibleNotification } from "@/components/dismissible-notification";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { hasServerSupabaseEnv } from "@/lib/supabase/server-env";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/warehouse/priority-queue", label: "Priority Queue" },
  ];

  const hasPublicSupabaseConfig = hasPublicSupabaseEnv();
  const hasServerSupabaseConfig = hasServerSupabaseEnv();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              Shop ML Pipeline
            </h1>

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
            <DismissibleNotification
              className="border border-slate-200 bg-slate-50 text-slate-600"
              badgeClassName="bg-cyan-100 text-cyan-800"
              dotClassName="bg-cyan-500"
            >
              Customer dashboard and queue routes now read from the Supabase
              dataset when environment configuration is available.
            </DismissibleNotification>

            <DismissibleNotification
              className="border border-emerald-200 bg-emerald-50 text-emerald-900"
              badgeClassName="bg-emerald-100 text-emerald-800"
              dotClassName="bg-emerald-500"
            >
              {hasPublicSupabaseConfig
                ? "Supabase public env detected."
                : "Supabase public env missing."}{" "}
              {hasServerSupabaseConfig
                ? "Server-side secret key is also available."
                : "Server-side secret key is not configured."}
            </DismissibleNotification>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">{children}</div>
    </div>
  );
}
