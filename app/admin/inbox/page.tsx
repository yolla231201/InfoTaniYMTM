"use client";
import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import FilterBar from "@/components/admin/inbox/FilterBar";
import { StatusKiriman, statusColor, statusLabel } from "@/components/admin/mockData";
import { useKiriman } from "@/components/admin/context/KirimanContext";


export default function InboxPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKiriman | "semua">("semua");
  const [kategori, setKategori] = useState("semua");
  const { kirimanList } = useKiriman();

  // Inbox hanya berisi narasi mentah yang belum dipublish (belum berstatus arsip)
  const narasiMentah = kirimanList.filter((k) => k.status !== "arsip");

  const filtered = narasiMentah.filter((k) => {
    const matchSearch =
      k.judulKegiatan.toLowerCase().includes(search.toLowerCase()) ||
      k.namaLengkap.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "semua" || k.status === status;
    const matchKategori = kategori === "semua" || k.kategoriKegiatan === kategori;
    return matchSearch && matchStatus && matchKategori;
  });

  return (
    <AdminLayout>

      {/* Filter */}
      <div className="mb-4">
        <FilterBar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          kategori={kategori}
          onKategori={setKategori}
        />
      </div>

      {/* List */}
      {/* List - narasi mentah, tanpa card */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <p className="text-sm text-gray-400">Tidak ada kiriman ditemukan</p>
          </div>
        ) : (
          filtered.map((k) => (
            <Link
              key={k.id}
              href={`/admin/inbox/${k.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#5CB85C]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {k.namaLengkap} · {(() => {
                    const s = k.tanggalMasuk;
                    if (!s) return "-";
                    const d = s.includes("T") ? new Date(s) : new Date(s.replace(/(\d+)\/(\d+)\/(\d+),?\s*(.*)/, "$3-$2-$1T$4"));
                    return isNaN(d.getTime()) ? s : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                  })()}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[k.status]}`}>
                  {statusLabel[k.status]}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {k.isiCerita}
              </p>
            </Link>
          ))
        )}
      </div>
    </AdminLayout>
  );
}