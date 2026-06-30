
import { createBrowserClient } from "@supabase/ssr";

// Dipakai di Client Component ("use client") — session disimpan di cookie
// supaya bisa dibaca juga oleh proxy.ts di server.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}