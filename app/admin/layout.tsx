"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/layout/Sidebar";
import Header from "@/components/admin/layout/Header";
import { KirimanProvider } from "@/components/admin/context/KirimanContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/set-password";
  const [sidebarOpen, setSidebarOpen] = useState(false);

if (isAuthPage) {
  return <>{children}</>;
}

  return (
    <KirimanProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header pathname={pathname} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </KirimanProvider>
  );
}