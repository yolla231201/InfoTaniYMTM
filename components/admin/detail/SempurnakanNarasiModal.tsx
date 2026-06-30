"use client";
import { useState } from "react";
import { Kiriman } from "../mockData";
import ConfirmModal from "../shared/ConfirmModal";

interface SempurnakanNarasiModalProps {
  show: boolean;
  kiriman: Kiriman;
  onClose: () => void;
  onGenerated: (judul: string, isiCerita: string) => void;
}

type Panjang = "pendek" | "sedang" | "panjang";
type Tone = "formal" | "santai" | "inspiratif";
type Target = "petani" | "umum" | "pemerintah";

const panjangOptions: { id: Panjang; label: string }[] = [
  { id: "pendek", label: "Pendek" },
  { id: "sedang", label: "Sedang" },
  { id: "panjang", label: "Panjang" },
];

const toneOptions: { id: Tone; label: string }[] = [
  { id: "formal", label: "Formal" },
  { id: "santai", label: "Santai" },
  { id: "inspiratif", label: "Inspiratif" },
];

const targetOptions: { id: Target; label: string }[] = [
  { id: "petani", label: "Petani" },
  { id: "umum", label: "Umum" },
  { id: "pemerintah", label: "Pemerintah" },
];

function buildDefaultPrompt(kiriman: Kiriman): string {
  return `Bertindaklah sebagai Jurnalis Profesional dan Redaktur Berita Senior. Tugas Anda adalah menyusun sebuah ARTIKEL BERITA (Straight News) yang aktual, tajam, dan objektif berdasarkan data mentah yang saya sediakan di bawah.

Aturan Emas Penulisan Berita:
1. Judul Berita (Headline): Buatlah 3 pilihan judul yang menarik, ringkas, menggunakan kalimat aktif, dan mencerminkan inti peristiwa terbesar (bukan sekadar judul administratif).
2. Struktur Piramida Terbalik (5W+1H):
   - Paragraf 1 (Lead/Teras Berita): Wajib memuat unsur Who (Siapa), What (Apa), Where (Di mana), dan When (Kapan) secara padat dalam maksimal 2 kalimat. Tempatkan fakta paling penting di sini.
   - Paragraf Berikutnya (Tubuh Berita): Jelaskan kronologi atau proses (How) dan latar belakang atau alasan (Why). Informasi disusun dari yang paling penting hingga informasi pendukung.
3. Gaya Bahasa Jurnalistik: Wajib formal, lugas, netral (bebas dari opini pribadi penulis), menggunakan kalimat aktif, dan sepenuhnya patuh pada PUEBI (Ejaan yang Disempurnakan).
4. Integrasi Kutipan (Atribusi): Tuliskan pernyataan narasumber menggunakan format kutipan langsung ("...") yang mengalir dan sejalan dengan standar penulisan media massa (Sebutkan Nama dan Jabatan/Peran narasumber).
5. Penutup: Akhiri dengan kesimpulan peristiwa, langkah selanjutnya, atau harapan terkait dampak dari peristiwa tersebut.

Berikut adalah Data Peristiwa yang akan diolah:
- Nama Organisasi/Pihak Terkait: Yayasan Mitra Tani Mandiri
- Peristiwa/Kegiatan Utama (What): ${kiriman.judulKegiatan}
- Lokasi Kejadian (Where): ${kiriman.lokasiKegiatan}
- Waktu Kejadian (When): ${kiriman.tanggalKegiatan}
- Tokoh/Narasumber yang Terlibat (Who): (ekstrak dari narasi mentah di bawah)
- Latar Belakang/Tujuan (Why): (ekstrak dari narasi mentah di bawah)
- Kronologi/Detail Jalannya Kegiatan (How): (ekstrak dari narasi mentah di bawah)
- Data Angka/Statistik Penting (Jika ada): (ekstrak dari narasi mentah di bawah)
- Pernyataan/Kutipan Penting Narasumber: (ekstrak dari narasi mentah di bawah)

Narasi Mentah dari Penyuluh Lapangan:
"""
${kiriman.isiCerita}
"""

PENTING — Format Output:
Tulis hasil akhir dengan format persis seperti ini, tanpa tambahan apapun di luar format ini:
JUDUL: [pilih 1 judul terbaik dari 3 opsi yang kamu buat]
ISI:
[isi artikel lengkap sesuai struktur di atas]`;
}

export default function SempurnakanNarasiModal({ show, kiriman, onClose, onGenerated }: SempurnakanNarasiModalProps) {
  const [prompt, setPrompt] = useState(() => buildDefaultPrompt(kiriman));
  const [panjang, setPanjang] = useState<Panjang>("sedang");
  const [tone, setTone] = useState<Tone>("formal");
  const [target, setTarget] = useState<Target>("umum");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleGenerateClick = () => {
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirm(false);
    setIsGenerating(true);
    setError(null);

    const finalPrompt = `${prompt}

Preferensi tambahan:
- Panjang artikel: ${panjang}
- Tone bahasa: ${tone}
- Target pembaca utama: ${target}`;

    try {
      const res = await fetch("/api/admin/generate/artikel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, narasi: "" }),
      });
      const data = await res.json();

      if (data.error) {
        setError("Gagal generate: " + data.error);
        setIsGenerating(false);
        return;
      }

      const hasil: string = data.hasil ?? "";
      const judulMatch = hasil.match(/JUDUL:\s*(.+)/i);
      const isiMatch = hasil.match(/ISI:\s*([\s\S]+)/i);

      const judulBaru = judulMatch ? judulMatch[1].trim() : kiriman.judulKegiatan;
      const isiBaru = isiMatch ? isiMatch[1].trim() : hasil.trim();

      onGenerated(judulBaru, isiBaru);
      setIsGenerating(false);
      onClose();
    } catch {
      setError("Terjadi kesalahan koneksi.");
      setIsGenerating(false);
    }
  };

  const segmentedClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      active ? "bg-[#10a37f] text-white" : "bg-white text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] px-4 py-8" onClick={onClose}>
        <div
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#10a37f]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#10a37f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-800">Sempurnakan Narasi dengan AI</h3>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Prompt — bisa diedit sesuai kebutuhan
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={16}
              className="w-full text-xs text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10a37f]/30 focus:border-[#10a37f] transition resize-none font-mono"
            />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">{error}</p>
            )}
          </div>

          {/* Footer — opsi + tombol generate */}
          <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              {/* Panjang Artikel */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Panjang</span>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {panjangOptions.map((p) => (
                    <button key={p.id} type="button" onClick={() => setPanjang(p.id)} className={segmentedClass(panjang === p.id)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Bahasa */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Tone</span>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {toneOptions.map((t) => (
                    <button key={t.id} type="button" onClick={() => setTone(t.id)} className={segmentedClass(tone === t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Pembaca */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Target Pembaca</span>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {targetOptions.map((t) => (
                    <button key={t.id} type="button" onClick={() => setTarget(t.id)} className={segmentedClass(target === t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tombol Generate */}
              <button
                onClick={handleGenerateClick}
                disabled={isGenerating || !prompt.trim()}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#10a37f] hover:bg-[#0d8d6c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate dengan AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Generate Narasi Baru?"
        message="AI akan membuat ulang isi cerita dan judul berdasarkan prompt ini. Hasilnya akan menggantikan isi cerita dan judul saat ini. Lanjutkan?"
        confirmLabel="Ya, Generate"
        variant="default"
        onConfirm={handleConfirmGenerate}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}