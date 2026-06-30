"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Kiriman, statusLabel, statusColor, outputStatusLabel, outputStatusColor } from "../mockData";
import ConfirmModal from "../shared/ConfirmModal";
import Toast from "../shared/Toast";
import SempurnakanNarasiModal from "./SempurnakanNarasiModal";
import { useKiriman } from "../context/KirimanContext";



interface AksiPanelProps {
  kiriman: Kiriman;
  isiCerita: string;
  onIsiCeritaChange: (val: string) => void;
  judulKegiatan: string;
  onJudulChange: (val: string) => void;
}

interface OutputRowProps {
  label: string;
  status: "belum" | "proses" | "tayang";
  icon: React.ReactNode;
}

function OutputRow({ label, status, icon }: OutputRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs text-gray-600 font-medium">{label}</span>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${outputStatusColor[status]}`}>
        {outputStatusLabel[status]}
      </span>
    </div>
  );
}

export default function AksiPanel({ kiriman, isiCerita, onIsiCeritaChange, judulKegiatan, onJudulChange }: AksiPanelProps) {
  const router = useRouter();
  const { updateKiriman } = useKiriman();

  const adaFoto = !!(kiriman.linkFoto && kiriman.linkFoto.trim() !== "");
  const adaVideo = !!(kiriman.linkVideo && kiriman.linkVideo.trim() !== "");

  const fotoSelesai =
    kiriman.outputStatus.facebook === "tayang" &&
    kiriman.outputStatus.instagram === "tayang" &&
    kiriman.outputStatus.tiktokFoto === "tayang";

  const videoSelesai =
    kiriman.outputStatus.facebookReels === "tayang" &&
    kiriman.outputStatus.tiktokVideo === "tayang" &&
    kiriman.outputStatus.instagramReels === "tayang" &&
    kiriman.outputStatus.youtubeShorts === "tayang";

  const artikelSelesai = kiriman.outputStatus.artikel === "tayang";

  const semuaTayang = artikelSelesai && (!adaFoto || fotoSelesai) && (!adaVideo || videoSelesai);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [showSempurnakanModal, setShowSempurnakanModal] = useState(false);
  const [isSimpan, setIsSimpan] = useState(false);

  const handleNarasiGenerated = (judulBaru: string, isiBaru: string) => {
    onJudulChange(judulBaru);
    onIsiCeritaChange(isiBaru);
    setToastMsg("Narasi berhasil disempurnakan. Jangan lupa klik Simpan Sementara.");
    setToastType("success");
    setShowToast(true);
  };

  const handleSimpanSementara = async () => {
    setIsSimpan(true);
    try {
      const res = await fetch("/api/admin/kiriman/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: kiriman.id, updates: { isiCerita, judulKegiatan } }),
      });
      const data = await res.json();
      if (data.success) {
        updateKiriman(kiriman.id, { isiCerita, judulKegiatan });
        setToastMsg("Isi cerita berhasil disimpan.");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMsg("Gagal menyimpan: " + (data.error || ""));
        setToastType("error");
        setShowToast(true);
      }
    } catch {
      setToastMsg("Terjadi kesalahan koneksi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSimpan(false);
    }
  };


  const handleArsipkan = () => {
    setShowConfirm(false);
    updateKiriman(kiriman.id, { status: "arsip" });
    setToastMsg("Berhasil! Konten sudah tayang di semua platform dan telah masuk ke Arsip.");
    setToastType("success");
    setShowToast(true);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Status Kiriman */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-3">Status Kiriman</p>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusColor[kiriman.status]}`}>
          {statusLabel[kiriman.status]}
        </span>

        {/* Dua tombol baru di bawah status kiriman */}
        <div className="flex flex-col gap-2 mt-4">
          {/* Sempurnakan Narasi — dinonaktifkan sementara (dalam pengembangan) */}
          <button
            onClick={() => setShowSempurnakanModal(true)}
            disabled
            title="Fitur ini sedang dalam pengembangan"
            className="cursor-not-allowed flex items-center gap-2 w-full px-4 py-2.5 border rounded-xl text-sm font-medium transition-all bg-gray-50 border-gray-200 text-gray-400"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Sempurnakan Narasi (Segera Hadir)
          </button>

          {/* Simpan Sementara */}
          <button
            onClick={handleSimpanSementara}
            disabled={isSimpan}
            className="cursor-pointer flex items-center gap-2 w-full px-4 py-2.5 border rounded-xl text-sm font-medium transition-all bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-600 disabled:opacity-60"
          >
            {isSimpan ? (
              <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5l-5.25-4.5-5.25 4.5V3.75m10.5 0h-10.5" />
              </svg>
            )}
            {isSimpan ? "Menyimpan..." : "Simpan Sementara"}
          </button>
        </div>
      </div>

      {/* Status Output per Platform */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-3">Status Output</p>

        {/* Artikel — selalu ada */}
        <OutputRow
          label="Artikel Website"
          status={kiriman.outputStatus.artikel}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          }
        />

        {/* Facebook & Instagram — selalu ada (foto saja atau foto+video) */}
        {adaFoto && (
          <>
            <OutputRow
              label="Facebook"
              status={kiriman.outputStatus.facebook}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              }
            />
            <OutputRow
              label="Instagram (Poster)"
              status={kiriman.outputStatus.instagram}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                </svg>
              }
            />
            <OutputRow
              label="TikTok (Foto)"
              status={kiriman.outputStatus.tiktokFoto}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              }
            />
          </>
        )}

        {/* Video platforms — hanya jika ada video */}
        {adaVideo && (
          <>
            <div className="mt-2 mb-1">
              <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">Distribusi Video</p>
            </div>
            <OutputRow
              label="YouTube Shorts"
              status={kiriman.outputStatus.youtubeShorts}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              }
            />
            <OutputRow
              label="TikTok (Video)"
              status={kiriman.outputStatus.tiktokVideo}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              }
            />

            <OutputRow
              label="Facebook Reels"
              status={kiriman.outputStatus.facebookReels}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              }
            />

            <OutputRow
              label="Instagram Reels"
              status={kiriman.outputStatus.instagramReels}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Aksi Produksi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-3">Aksi Produksi</p>
        <div className="flex flex-col gap-2">

          {/* Buat Artikel — selalu ada */}
          <button
            onClick={() => router.push(`/admin/artikel?id=${kiriman.id}`)}
            disabled={artikelSelesai}
            className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all ${artikelSelesai
              ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
              : "bg-[#5CB85C]/5 hover:bg-[#5CB85C]/10 border-[#5CB85C]/20 text-[#5CB85C]"
              }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            {artikelSelesai ? "Artikel Sudah Tayang" : "Buat Artikel"}
          </button>

          {/* Distribusi Foto — ada jika ada foto */}
          {adaFoto && (
            <button
              onClick={() => router.push(`/admin/video?id=${kiriman.id}&tab=foto`)}
              disabled={true}
              className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all ${fotoSelesai
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600"
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 4.5h15A2.25 2.25 0 0121.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z" />
              </svg>
              {fotoSelesai ? "Foto Sudah Tayang" : "Distribusi Foto"}
            </button>
          )}

          {/* Distribusi Video — ada jika ada video */}
          {adaVideo && (
            <button
              onClick={() => router.push(`/admin/video?id=${kiriman.id}&tab=video`)}
              disabled={true}
              className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all ${videoSelesai
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                : "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-600"
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {videoSelesai ? "Video Sudah Tayang" : "Distribusi Video"}
            </button>
          )}
        </div>
      </div>

      {/* Arsipkan */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={!semuaTayang}
        className={`cursor-pointer w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${semuaTayang
          ? "bg-white border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-500"
          : "bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        Arsipkan Kiriman
      </button>

      <ConfirmModal
        show={showConfirm}
        title="Arsipkan Kiriman?"
        message="Semua konten sudah tayang di seluruh platform. Tindakan ini akan memindahkan kiriman ke Arsip."
        confirmLabel="Ya, Arsipkan"
        variant="default"
        onConfirm={handleArsipkan}
        onCancel={() => setShowConfirm(false)}
      />

      <SempurnakanNarasiModal
        show={showSempurnakanModal}
        kiriman={{ ...kiriman, judulKegiatan, isiCerita }}
        onClose={() => setShowSempurnakanModal(false)}
        onGenerated={handleNarasiGenerated}
      />

    </div>
  );
}