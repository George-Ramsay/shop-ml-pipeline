import { createClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getPublicSupabaseEnv();

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase public env vars. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(url, publishableKey, {
    auth: {
      persistSession: false,
    },
  });
}
