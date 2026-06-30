"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/admin": { title: "Dashboard", desc: "Ringkasan aktivitas & kiriman terbaru" },
  "/admin/artikel": { title: "Editor Artikel", desc: "Tulis & generate artikel dengan AI" },
  "/admin/video": { title: "Distribusi Konten", desc: "Upload & distribusi foto/video ke semua platform" },
  "/admin/kalender": { title: "Kalender Konten", desc: "Jadwal publikasi konten" },
  "/admin/arsip": { title: "Arsip", desc: "Kiriman yang sudah diproses" },
};

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const matchKey = Object.keys(pageTitles)
    .filter((k) => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];

  const pageInfo = pageTitles[matchKey] ?? { title: "Admin", desc: "" };

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/admin/login");
};

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-bold text-gray-800 leading-tight">{pageInfo.title}</h1>
        {pageInfo.desc && (
          <p className="text-xs text-gray-400 leading-tight">{pageInfo.desc}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifikasi */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#5CB85C]/10 flex items-center justify-center">
            <span className="text-xs font-bold text-[#5CB85C]">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-700 leading-tight">Admin</p>
            <p className="text-[10px] text-gray-400 leading-tight">IT Team</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-gray-400"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}