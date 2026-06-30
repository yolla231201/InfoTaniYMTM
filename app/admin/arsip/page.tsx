"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useKiriman } from "@/components/admin/context/KirimanContext";
import ArsipTable from "@/components/admin/arsip/ArsipTable";

export default function ArsipPage() {
  const [search, setSearch] = useState("");
  const { kirimanList } = useKiriman();

  const arsip = kirimanList.filter((k) => {
  const matchStatus = k.status === "arsip";
  const matchSearch =
    k.judulKegiatan.toLowerCase().includes(search.toLowerCase()) ||
    k.namaLengkap.toLowerCase().includes(search.toLowerCase());
  return matchStatus && matchSearch;
});

  return (
    <AdminLayout>
      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Cari kiriman..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition placeholder-gray-300"
        />
      </div>
      <ArsipTable data={arsip} />
    </AdminLayout>
  );
}