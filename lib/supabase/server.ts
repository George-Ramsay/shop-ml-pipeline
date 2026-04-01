import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServerSupabaseEnv } from "@/lib/supabase/server-env";

export function createSupabaseServerClient() {
  const { url, secretKey } = getServerSupabaseEnv();

  if (!url || !secretKey) {
    throw new Error(
      "Missing Supabase server env vars. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
