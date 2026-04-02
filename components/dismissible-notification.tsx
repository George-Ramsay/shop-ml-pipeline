"use client";

import { useState, type ReactNode } from "react";

type DismissibleNotificationProps = {
  children: ReactNode;
  className: string;
  badgeClassName: string;
  dotClassName: string;
};

export function DismissibleNotification({
  children,
  className,
  badgeClassName,
  dotClassName,
}: DismissibleNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`relative rounded-2xl px-4 py-3 pr-12 text-sm ${className}`}>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        aria-label="Dismiss notification"
      >
        <span aria-hidden="true" className="text-base leading-none">
          x
        </span>
      </button>

      <div className="flex items-center justify-between gap-3">
        <p>{children}</p>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeClassName}`}>
          <span className={`size-1.5 animate-pulse rounded-full ${dotClassName}`} aria-hidden="true" />
          Live
        </span>
      </div>
    </div>
  );
}
