"use client";
import { useState } from "react";

interface ChatGPTPanelProps {
  narasiAsli: string;
  onGenerate: (hasil: string) => void;
}

const promptOptions = [
  { label: "Artikel Berita", prompt: "Tulis artikel berita pertanian formal berdasarkan narasi berikut:" },
  { label: "Artikel Blog", prompt: "Tulis artikel blog informatif dan menarik berdasarkan narasi berikut:" },
  { label: "Caption Instagram", prompt: "Buat caption Instagram singkat dan menarik berdasarkan narasi berikut:" },
  { label: "Script Video", prompt: "Buat script narasi video pendek (60 detik) berdasarkan narasi berikut:" },
];

export default function ChatGPTPanel({ narasiAsli, onGenerate }: ChatGPTPanelProps) {
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

const handleGenerate = async () => {
  if (!narasiAsli.trim()) return;
  setIsGenerating(true);

  try {
    const promptText = customPrompt
      ? `${promptOptions[selectedPrompt].prompt}\n\nInstruksi tambahan: ${customPrompt}`
      : promptOptions[selectedPrompt].prompt;

    const res = await fetch("/api/admin/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText, narasi: narasiAsli }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Gagal generate: " + data.error);
    } else {
      onGenerate(data.hasil);
    }
  } catch {
    alert("Terjadi kesalahan. Periksa koneksi internet.");
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#10a37f]/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#10a37f]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0L4.1 14.03a4.5 4.5 0 01-1.76-6.134zM19.09 12.25l-5.816-3.356 2.021-1.168a.075.075 0 01.071 0l4.718 2.723a4.5 4.5 0 01-.68 8.117v-5.678a.79.79 0 00-.314-.638zm2.019-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.57 9.703V7.371a.075.075 0 01.03-.063l4.716-2.72a4.5 4.5 0 016.763 4.638zm-12.66 4.135l-2.02-1.167a.08.08 0 01-.038-.057V6.559a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">Generate dengan AI</p>
      </div>

      {/* Pilih tipe konten */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Tipe konten</p>
        <div className="grid grid-cols-2 gap-2">
          {promptOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrompt(i)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all ${selectedPrompt === i
                  ? "bg-[#10a37f]/10 text-[#10a37f] border-[#10a37f]/30"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom prompt */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Instruksi tambahan (opsional)</p>
        <textarea
          rows={3}
          placeholder="Contoh: Gunakan bahasa yang mudah dipahami petani, sertakan tips praktis..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#10a37f]/30 focus:border-[#10a37f] transition placeholder-gray-300 resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-[#10a37f] hover:bg-[#0d8f6f] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Generate Sekarang
          </>
        )}
      </button>
    </div>
  );
}