import "server-only";

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  null;

export function getServerSupabaseEnv() {
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? null,
    secretKey: supabaseSecretKey,
  };
}

export function hasServerSupabaseEnv() {
  const { url, secretKey } = getServerSupabaseEnv();

  return Boolean(url && secretKey);
}
