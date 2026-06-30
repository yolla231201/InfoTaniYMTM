
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Dipakai di Server Component, Server Action, atau Route Handler.
// Harus dipanggil ulang setiap request (tidak bisa disimpan sebagai singleton)
// karena perlu membaca cookies dari request yang sedang berjalan.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component — boleh diabaikan
            // karena proxy.ts sudah menangani refresh session.
          }
        },
      },
    }
  );
}