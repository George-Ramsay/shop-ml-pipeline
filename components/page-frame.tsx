import Link from "next/link";
import type { ReactNode } from "react";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: Array<{
    href: string;
    label: string;
  }>;
  children?: ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageFrameProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur md:p-10">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
            {eyebrow}
          </p>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {title}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </section>
  );
}
