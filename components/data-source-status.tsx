import { getDataSourceMode } from "@/lib/supabase/env";
import { hasServerSupabaseEnv } from "@/lib/supabase/server-env";

export function DataSourceStatus() {
  const mode = getDataSourceMode();
  const hasServerKey = hasServerSupabaseEnv();

  if (mode === "supabase") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Supabase public env detected.{" "}
        {hasServerKey
          ? "Server-side secret key is also available."
          : "Server-side secret key is still missing."}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Running in mock data mode until `NEXT_PUBLIC_SUPABASE_URL` and
      `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are available.
    </div>
  );
}
