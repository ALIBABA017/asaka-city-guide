// Client for the project's OWN Supabase instance (project ref: mytnlmmhbsdesxyuwjdn).
// This is separate from the auto-generated Lovable Cloud client, which the app no longer uses.
//
// SECURITY: only the publishable/anon key may live here. Never put an `sb_secret_*`
// (service role) key in client code — it bypasses row-level security.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_MY_SUPABASE_URL || "https://mytnlmmhbsdesxyuwjdn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_MY_SUPABASE_PUBLISHABLE_KEY;

export const isMySupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

function createMyClient(): SupabaseClient {
  if (!isMySupabaseConfigured) {
    throw new Error(
      "Missing VITE_MY_SUPABASE_PUBLISHABLE_KEY. Add your Supabase publishable (anon) key to .env.",
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _client: SupabaseClient | undefined;

export const mySupabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!_client) _client = createMyClient();
    return Reflect.get(_client, prop, receiver);
  },
});

// Table names exactly as they exist in your database.
export const TABLES = {
  business: "business",
  users: "users",
  bookings: "bookings",
  reviews: "reviews",
} as const;

export const STORAGE_BUCKET = "business-photos";

export function businessPhotoUrl(path: string) {
  return mySupabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
