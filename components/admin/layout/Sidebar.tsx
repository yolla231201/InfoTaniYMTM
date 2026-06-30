"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


const navItems = [
  {
  href: "/admin",
  label: "Dashboard",
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
},
  {
    href: "/admin/inbox",
    label: "Inbox",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
      </svg>
    ),
  },
  {
    href: "/admin/arsip",
    label: "Arsip",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Overlay gelap — hanya muncul di mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`w-64 shrink-0 h-screen bg-white border-l md:border-l-0 md:border-r border-gray-100 flex flex-col
        fixed md:sticky top-0 right-0 md:right-auto z-50 md:z-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        {/* Logo + tombol close (mobile) */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-ymtm-hijau.png"
              alt="Logo YMTM"
              width={36}
              height={36}
              className="object-contain"
            />
            <div>
              <p className="text-sm font-bold text-gray-800 leading-tight">InfoTani</p>
              <p className="text-[10px] text-gray-400 leading-tight">Panel Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive(item.href)
                  ? "bg-[#5CB85C]/10 text-[#5CB85C]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <span className={isActive(item.href) ? "text-[#5CB85C]" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout — hanya tampil di mobile, karena di desktop sudah ada di Header */}
        <div className="px-3 py-3 border-t border-gray-100 md:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>

        {/* Bottom - back to site */}
        <div className="px-3 py-4 border-t border-gray-100">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-xm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-150"
          >
            InfoTani YMTM
          </Link>
        </div>
      </aside>
    </>
  );
}