const publicSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  null;

const publicSupabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  null;

export function getPublicSupabaseEnv() {
  return {
    url: publicSupabaseUrl,
    publishableKey: publicSupabasePublishableKey,
  };
}

export function hasPublicSupabaseEnv() {
  return Boolean(publicSupabaseUrl && publicSupabasePublishableKey);
}

export function getDataSourceMode() {
  return hasPublicSupabaseEnv() ? "supabase" : "mock";
}
