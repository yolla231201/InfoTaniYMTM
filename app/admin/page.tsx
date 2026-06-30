"use client";

import Link from "next/link";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { statusLabel, statusColor, kategoriLabel } from "@/components/admin/mockData";
import { useKiriman } from "@/components/admin/context/KirimanContext";
import KirimanCard from "@/components/admin/inbox/KirimanCard";

export default function DashboardPage() {
  const { kirimanList } = useKiriman();
  const narasiMentah = kirimanList.filter((k) => k.status !== "arsip");
  const narasiPublish = kirimanList.filter((k) => k.status === "arsip");

  const terbaruMentah = [...narasiMentah]
    .sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
    .slice(0, 5);

  const terbaruPublish = [...narasiPublish]
    .sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      {/* Stats — sama seperti yang dipakai di Inbox */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Kiriman", value: kirimanList.length, color: "text-gray-800" },
          { label: "Baru", value: kirimanList.filter((k) => k.status === "baru").length, color: "text-blue-600" },
          { label: "Draft", value: kirimanList.filter((k) => k.status === "draft").length, color: "text-amber-600" },
          { label: "Arsip", value: kirimanList.filter((k) => k.status === "arsip").length, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 5 Narasi mentah terbaru */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Narasi Mentah Terbaru</p>
            <Link href="/admin/inbox" className="text-xs text-[#5CB85C] font-medium hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {terbaruMentah.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Belum ada narasi mentah masuk.</p>
            ) : (
              terbaruMentah.map((k) => <KirimanCard key={k.id} kiriman={k} />)
            )}
          </div>
        </div>

        {/* 5 Narasi yang sudah dipublish */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Narasi Sudah Dipublish</p>
            <Link href="/admin/arsip" className="text-xs text-[#5CB85C] font-medium hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {terbaruPublish.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Belum ada narasi yang dipublish.</p>
            ) : (
              terbaruPublish.map((k) => (
                <Link
                  key={k.id}
                  href={`/admin/inbox/${k.id}`}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{k.judulKegiatan}</p>
                    <p className="text-xs text-gray-400">{k.namaLengkap} · {kategoriLabel[k.kategoriKegiatan] ?? k.kategoriKegiatan}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full border ${statusColor[k.status]}`}>
                    {statusLabel[k.status]}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}