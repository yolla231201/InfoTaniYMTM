import Link from "next/link";
import { Kiriman, statusLabel, statusColor, kategoriLabel } from "../mockData";

interface KirimanCardProps {
  kiriman: Kiriman;
}

export default function KirimanCard({ kiriman }: KirimanCardProps) {
  // Jadi:
  const rawTanggal = kiriman.tanggalMasuk;
  const parsed = rawTanggal
    ? rawTanggal.includes("T")
      ? new Date(rawTanggal)
      : new Date(rawTanggal.replace(/(\d+)\/(\d+)\/(\d+),?\s*(.*)/, "$3-$2-$1T$4"))
    : null;
  const tanggalMasuk = parsed && !isNaN(parsed.getTime())
    ? parsed.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : rawTanggal;

  return (
    <Link href={`/admin/inbox/${kiriman.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#5CB85C]/40 hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColor[kiriman.status]}`}>
                {statusLabel[kiriman.status]}
              </span>
              <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">
                {kategoriLabel[kiriman.kategoriKegiatan] ?? kiriman.kategoriKegiatan}
              </span>
            </div>

            {/* Judul */}
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#5CB85C] transition-colors line-clamp-2 leading-snug">
              {kiriman.judulKegiatan}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {kiriman.namaLengkap}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {kiriman.lokasiKegiatan}
              </span>
              {(kiriman.media?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {kiriman.media?.length ?? 0} media
                </span>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-right shrink-0">
            <p className="text-[11px] text-gray-400">{tanggalMasuk}</p>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#5CB85C] ml-auto mt-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}