import Link from "next/link";
import { Kiriman, statusColor, statusLabel, kategoriLabel } from "../mockData";

interface ArsipTableProps {
  data: Kiriman[];
}

export default function ArsipTable({ data }: ArsipTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
        <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p className="text-sm text-gray-400">Tidak ada kiriman ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Judul Kegiatan</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Penyuluh</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Media</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Tanggal Masuk</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((k) => (
            <tr key={k.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-5 py-4 max-w-xs">
                <p className="font-medium text-gray-800 line-clamp-1 group-hover:text-[#5CB85C] transition-colors">
                  {k.judulKegiatan}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{k.lokasiKegiatan}</p>
              </td>
              <td className="px-5 py-4 text-gray-600 hidden md:table-cell">
                <p className="text-sm">{k.namaLengkap}</p>
                <p className="text-xs text-gray-400">{k.wilayah.split(",")[0]}</p>
              </td>
              <td className="px-5 py-4 hidden sm:table-cell">
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {kategoriLabel[k.kategoriKegiatan] ?? k.kategoriKegiatan}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor[k.status]}`}>
                  {statusLabel[k.status]}
                </span>
              </td>
              <td className="px-5 py-4 hidden lg:table-cell">
                <span className="text-xs text-gray-500">{k.media.length} file</span>
              </td>
              <td className="px-5 py-4 text-xs text-gray-400 hidden lg:table-cell whitespace-nowrap">
                {new Date(k.tanggalMasuk).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </td>
              <td className="px-5 py-4">
                <Link
                  href={`/admin/inbox/${k.id}`}
                  className="text-xs text-[#5CB85C] hover:underline font-semibold whitespace-nowrap"
                >
                  Lihat →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}