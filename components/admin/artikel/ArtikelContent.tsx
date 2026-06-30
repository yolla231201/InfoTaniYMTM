"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ChatGPTPanel from "@/components/admin/artikel/ChatGPTPanel";
import PilihFotoUtama from "@/components/admin/artikel/PilihFotoUtama";
import PilihKategori from "@/components/admin/artikel/PilihKategori";
import Toast, { ToastType } from "@/components/admin/shared/Toast";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { useKiriman } from "@/components/admin/context/KirimanContext";

export default function ArtikelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getKiriman, updateKiriman } = useKiriman();
  const kiriman = getKiriman(id ?? "");

  const fotoList = kiriman?.linkFoto ? kiriman.linkFoto.split(", ").filter(Boolean) : [];

  const [judul, setJudul] = useState(kiriman?.judulKegiatan ?? "");
  const [konten, setKonten] = useState(kiriman?.isiCerita ?? "");
  const [fotoUtama, setFotoUtama] = useState<string | null>(fotoList[0] ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const handlePublishClick = () => {
    if (!judul.trim() || !konten.trim()) {
      setToastMsg("Judul dan isi artikel wajib diisi sebelum publish.");
      setToastType("error");
      setShowToast(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmPublish = async () => {
    setShowConfirm(false);
    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/wordpress/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, konten, fotoUtamaUrl: fotoUtama, categoryId }),
      });
      const data = await res.json();

      if (!data.success) {
        setToastMsg("Gagal publish: " + (data.error || "Terjadi kesalahan."));
        setToastType("error");
        setShowToast(true);
        setIsPublishing(false);
        return;
      }

      // Simpan link artikel & status ke Spreadsheet
      if (kiriman) {
        await fetch("/api/admin/kiriman/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: kiriman.id,
            updates: { artikel: "tayang", linkArtikel: data.link, judulKegiatan: judul, isiCerita: konten },
          }),
        });
        updateKiriman(kiriman.id, {
          judulKegiatan: judul,
          isiCerita: konten,
          outputStatus: { ...kiriman.outputStatus, artikel: "tayang" },
        });
      }

      setToastMsg("Artikel berhasil dipublish ke website!");
      setToastType("success");
      setShowToast(true);
      setIsPublishing(false);
      setTimeout(() => router.push(`/admin/inbox/${kiriman?.id}`), 1500);
    } catch {
      setToastMsg("Terjadi kesalahan koneksi saat publish.");
      setToastType("error");
      setShowToast(true);
      setIsPublishing(false);
    }
  };

  const wordCount = konten.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Judul */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Judul Artikel</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul artikel..."
              className="w-full text-lg font-bold text-gray-800 bg-transparent focus:outline-none placeholder-gray-300 border-b border-gray-100 pb-2"
            />
          </div>

          {/* Konten */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Isi Artikel</label>
              <span className="text-xs text-gray-400">{wordCount} kata</span>
            </div>
            <textarea
              rows={20}
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              placeholder="Mulai menulis atau generate dengan AI di panel kanan..."
              className="w-full text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-300 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {kiriman?.outputStatus.artikel === "tayang" && (
                <span className="text-green-500 font-medium">✓ Sudah tayang di website</span>
              )}
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl transition-all font-medium">
                Pratinjau
              </button>
              <button
                onClick={handlePublishClick}
                disabled={isPublishing}
                className="px-5 py-2.5 text-sm bg-[#5CB85C] hover:bg-[#4cae4c] disabled:opacity-60 text-white rounded-xl transition-all font-semibold flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mempublish...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Publish ke Website
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="flex flex-col gap-4">
          {/* Sumber narasi */}
          {kiriman && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Sumber Narasi</p>
              <p className="text-sm font-semibold text-gray-700">{kiriman.namaLengkap}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kiriman.lokasiKegiatan} · {new Date(kiriman.tanggalKegiatan).toLocaleDateString("id-ID")}</p>
            </div>
          )}

          {/* Pilih Foto Utama */}
          <PilihFotoUtama fotoList={fotoList} selected={fotoUtama} onSelect={setFotoUtama} />

          {/* Pilih Kategori */}
          <PilihKategori selected={categoryId} onSelect={setCategoryId} />

          {/* ChatGPT Panel */}
          <ChatGPTPanel
            narasiAsli={kiriman?.isiCerita ?? konten}
            onGenerate={(hasil) => setKonten(hasil)}
          />
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Publish Artikel ke Website?"
        message="Artikel ini akan langsung tayang di website WordPress dan dapat dilihat publik. Pastikan judul, isi, dan foto utama sudah benar."
        confirmLabel="Ya, Publish"
        variant="default"
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowConfirm(false)}
      />

      <Toast
        type={toastType}
        message={toastMsg}
        duration={3}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}