"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import NarasiViewer from "@/components/admin/detail/NarasiViewer";
import AksiPanel from "@/components/admin/detail/AksiPanel";
import { useKiriman } from "@/components/admin/context/KirimanContext";

export default function DetailKirimanPage() {
  const params = useParams();
  const router = useRouter();
  const { getKiriman, updateKiriman } = useKiriman();
  const kiriman = getKiriman(params.id as string);

  const [isiCerita, setIsiCerita] = useState("");
  const [judulKegiatan, setJudulKegiatan] = useState("");


  useEffect(() => {
    if (kiriman) {
      setJudulKegiatan(kiriman.judulKegiatan);
      setIsiCerita(kiriman.isiCerita);
      if (kiriman.status === "baru") {
        updateKiriman(kiriman.id, { status: "draft" });
      }
    }
  }, [kiriman?.id]);

  if (!kiriman) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-400 text-sm">Kiriman tidak ditemukan.</p>
          <button onClick={() => router.push("/admin/inbox")} className="mt-4 text-[#5CB85C] text-sm hover:underline">
            ← Kembali ke Inbox
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        onClick={() => router.push("/admin/inbox")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Kembali ke Inbox
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <NarasiViewer
            kiriman={kiriman}
            isiCerita={isiCerita}
            onIsiCeritaChange={setIsiCerita}
            judulKegiatan={judulKegiatan}
            onJudulChange={setJudulKegiatan}
          />
        </div>
        <div>
          <AksiPanel kiriman={kiriman} isiCerita={isiCerita} onIsiCeritaChange={setIsiCerita} judulKegiatan={judulKegiatan} onJudulChange={setJudulKegiatan} />
        </div>
      </div>
    </AdminLayout>
  );
}