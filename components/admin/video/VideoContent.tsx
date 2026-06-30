"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useKiriman } from "@/components/admin/context/KirimanContext";

const platformVideo = [
  { id: "facebookReels", label: "Facebook Reels", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { id: "youtubeShorts", label: "YouTube Shorts", color: "text-red-500", bg: "bg-red-50 border-red-200" },
  { id: "tiktokVideo", label: "TikTok (Video)", color: "text-gray-800", bg: "bg-gray-50 border-gray-200" },
  { id: "instagramReels", label: "Instagram Reels", color: "text-pink-500", bg: "bg-pink-50 border-pink-200" },
];

const platformFoto = [
  { id: "facebook", label: "Facebook", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { id: "instagram", label: "Instagram (Poster)", color: "text-pink-500", bg: "bg-pink-50 border-pink-200" },
  { id: "tiktokFoto", label: "TikTok (Foto)", color: "text-gray-800", bg: "bg-gray-50 border-gray-200" },
];

export default function VideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tabParam = searchParams.get("tab");
  const { getKiriman, updateKiriman } = useKiriman();
  const kiriman = getKiriman(id ?? "");
  // Jadi:
const adaFoto = kiriman ? !!(kiriman.linkFoto && kiriman.linkFoto.trim() !== "") : true;
const adaVideo = kiriman ? !!(kiriman.linkVideo && kiriman.linkVideo.trim() !== "") : true;
  const [activeTab, setActiveTab] = useState<"foto" | "video">(() => {
    if (kiriman) {
      if (!adaVideo && adaFoto) return "foto";
      if (!adaFoto && adaVideo) return "video";
    }
    return tabParam === "foto" ? "foto" : "video";
  });
  const [dragOver, setDragOver] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, "pending" | "loading" | "done">>({});



  const togglePlatform = (id: string) => {
    setPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const acceptType = activeTab === "foto" ? "image/" : "video/";
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith(acceptType));
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const initialStatus: Record<string, "pending" | "loading" | "done"> = {};
    platforms.forEach((p) => { initialStatus[p] = "pending"; });
    setUploadStatus(initialStatus);

    for (const platformId of platforms) {
      setUploadStatus((prev) => ({ ...prev, [platformId]: "loading" }));
      await new Promise((r) => setTimeout(r, 1500));
      setUploadStatus((prev) => ({ ...prev, [platformId]: "done" }));


      // update outputStatus kiriman sesuai platform yang baru selesai
      if (kiriman) {
        updateKiriman(kiriman.id, {
          outputStatus: { ...kiriman.outputStatus, [platformId]: "tayang" },
        });
      }
    }

    setIsUploading(false);
    setUploaded(true);

    if (kiriman) {
      setTimeout(() => router.push(`/admin/inbox/${kiriman.id}`), 1200);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition placeholder-gray-300";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Form utama */}
      <div className="lg:col-span-2 flex flex-col gap-4">

        <div className="flex gap-2">
          {(["video", "foto"] as const)
            .filter((t) => (t === "video" ? adaVideo : adaFoto))
            .map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeTab === t ? "bg-[#5CB85C] text-white border-[#5CB85C]" : "bg-white text-gray-500 border-gray-200"
                  }`}
              >
                {t === "video" ? "Video" : "Foto"}
              </button>
            ))}
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-all ${dragOver ? "border-[#5CB85C] bg-[#5CB85C]/5" : "border-gray-200"
            }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drag & drop file {activeTab} di sini</p>
            <p className="text-xs text-gray-400 mt-1">
              {activeTab === "foto" ? "JPG, PNG — maks 10MB per file" : "MP4, MOV, AVI — maks 500MB per file"}
            </p>
          </div>
          <label className="mt-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600 font-medium cursor-pointer transition-all">
            Pilih File
            <input type="file" accept={activeTab === "foto" ? "image/*" : "video/*"} multiple onChange={handleFileChange} className="hidden" />
          </label>

          {/* File list */}
          {files.length > 0 && (
            <div className="w-full mt-2 flex flex-col gap-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#5CB85C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span className="text-xs text-gray-700 font-medium truncate max-w-xs">{f.name}</span>
                  </div>
                  <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Informasi Konten</p>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Judul {activeTab === "foto" ? "Foto" : "Video"}
            </label>
            <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder={`Judul konten ${activeTab}...`} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Deskripsi</label>
            <textarea rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi untuk caption / deskripsi platform..." className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Submit */}
        {uploaded ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700 font-medium">
              {activeTab === "foto" ? "Foto" : "Video"} berhasil diupload!
            </p>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isUploading || files.length === 0 || platforms.length === 0}
            className="cursor-pointer w-full bg-[#5CB85C] hover:bg-[#4cae4c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Mengupload...</>
            ) : "Upload & Distribusi"}
          </button>
        )}
      </div>



      {/* Platform distribusi */}
      <div className="flex flex-col gap-4">

        {kiriman && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Sumber Konten</p>
            <p className="text-sm font-semibold text-gray-700">{kiriman.namaLengkap}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kiriman.judulKegiatan}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Platform Distribusi</p>
          <div className="flex flex-col gap-2">
            {(activeTab === "foto" ? platformFoto : platformVideo).map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${platforms.includes(p.id) ? p.bg : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                <span className={platforms.includes(p.id) ? p.color : ""}>{p.label}</span>
                {platforms.includes(p.id) && (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {platforms.length === 0 && (
            <p className="text-xs text-amber-500 mt-3">Pilih minimal 1 platform untuk distribusi.</p>
          )}
        </div>


        {/* Status Pengiriman */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Status Pengiriman</p>

          {platforms.length === 0 ? (
            <p className="text-xs text-gray-400">Pilih platform untuk melihat status pengiriman.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(activeTab === "foto" ? platformFoto : platformVideo)
                .filter((p) => platforms.includes(p.id))
                .map((p) => {
                  const s = uploadStatus[p.id] ?? "pending";
                  return (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs font-medium text-gray-600">{p.label}</span>
                      {s === "done" ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : s === "loading" ? (
                        <svg className="w-4 h-4 text-[#5CB85C] animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}