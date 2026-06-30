import { Kiriman, kategoriLabel, hasVideo, hasPhoto, fotoCount, videoCount } from "../mockData";
import { getDriveThumbUrl } from "@/lib/driveUtils";
import { useState } from "react";
import MediaPreviewModal from "@/components/admin/shared/MediaPreviewModal";


interface NarasiViewerProps {
  kiriman: Kiriman;
  isiCerita: string;
  onIsiCeritaChange: (val: string) => void;
  judulKegiatan: string;                        // tambah
  onJudulChange: (val: string) => void;         // tambah
}

export default function NarasiViewer({ kiriman, isiCerita, onIsiCeritaChange, judulKegiatan, onJudulChange }: NarasiViewerProps) {
  const tanggal = new Date(kiriman.tanggalKegiatan).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const fotoList = kiriman.linkFoto ? kiriman.linkFoto.split(", ").filter(Boolean) : [];
  const videoList = kiriman.linkVideo ? kiriman.linkVideo.split(", ").filter(Boolean) : [];
  const adaFoto = fotoList.length > 0;
  const adaVideo = videoList.length > 0;
  const jumlahFoto = fotoList.length;
  const jumlahVideo = videoList.length;
  const [modalItem, setModalItem] = useState<{ url: string; type: "foto" | "video" } | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">

      {/* Judul + Badge Skenario */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start gap-2">
          <input
            value={judulKegiatan}
            onChange={(e) => onJudulChange(e.target.value)}
            className="text-lg font-bold text-gray-800 leading-snug flex-1 bg-transparent focus:outline-none border-b border-transparent focus:border-gray-300 transition-colors w-full"
          />
          {adaVideo && adaFoto && (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Foto + Video
            </span>
          )}
          {adaVideo && !adaFoto && (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Ada Video
            </span>
          )}
          {!adaVideo && adaFoto && (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 4.5h15A2.25 2.25 0 0121.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z" />
              </svg>
              Foto Saja
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">{tanggal}</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Penyuluh", value: kiriman.namaLengkap },
          { label: "No. HP", value: kiriman.nomorHP },
          { label: "Wilayah Tugas", value: kiriman.wilayah },
          { label: "Lokasi Kegiatan", value: kiriman.lokasiKegiatan },
          { label: "Kategori", value: kategoriLabel[kiriman.kategoriKegiatan] ?? kiriman.kategoriKegiatan },
          { label: "Media", value: `${jumlahFoto} foto • ${jumlahVideo} video` },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-sm text-gray-700 font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Isi Cerita */}
      <div>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Isi Cerita</p>
        <div className="bg-gray-50 rounded-xl px-4 py-4">
          <textarea
            value={isiCerita}
            onChange={(e) => onIsiCeritaChange(e.target.value)}
            rows={8}
            className="w-full text-sm text-gray-700 leading-relaxed bg-transparent focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Foto */}
      {adaFoto && (
        <div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">
            Foto Kegiatan ({jumlahFoto} file)
          </p>
          <div className="grid grid-cols-5 gap-2">
            {fotoList.map((url, i) => (
              <button key={i} onClick={() => setModalItem({ url, type: "foto" })}
                className="group relative aspect-square bg-gray-100 rounded-xl border border-gray-200 hover:border-[#5CB85C]/40 transition-all overflow-hidden"
              >
                <img
                  src={getDriveThumbUrl(url)}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg px-2 py-1">
                    Lihat
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      {adaVideo && (
        <div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">
            Video Mentah ({jumlahVideo} file)
          </p>
          <div className="flex flex-col gap-2">
            {videoList.map((url, i) => (
              <button key={i} onClick={() => setModalItem({ url, type: "video" })}
                className="group flex items-center justify-between w-full bg-purple-50 border border-purple-100 hover:border-purple-300 rounded-xl px-4 py-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm flex justify-start font-medium text-gray-700">Video {i + 1}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{url}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-500 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>

                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {modalItem && (
        <MediaPreviewModal
          url={modalItem.url}
          type={modalItem.type}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}