"use client";
import { useState } from "react";

interface ArtikelEditorProps {
  initialJudul?: string;
  initialKonten?: string;
  onSave?: (judul: string, konten: string) => void;
}

type FormatAction = "bold" | "italic" | "heading" | "quote" | "ul" | "ol";

export default function ArtikelEditor({ initialJudul = "", initialKonten = "", onSave }: ArtikelEditorProps) {
  const [judul, setJudul] = useState(initialJudul);
  const [konten, setKonten] = useState(initialKonten);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [tab, setTab] = useState<"tulis" | "pratinjau">("tulis");

  const wordCount = konten.trim().split(/\s+/).filter(Boolean).length;
  const charCount = konten.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleFormat = (action: FormatAction) => {
    const textarea = document.getElementById("artikel-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = konten.slice(start, end);

    const formats: Record<FormatAction, string> = {
      bold: `**${selected || "teks tebal"}**`,
      italic: `*${selected || "teks miring"}*`,
      heading: `\n## ${selected || "Judul Bagian"}\n`,
      quote: `\n> ${selected || "Kutipan di sini"}\n`,
      ul: `\n- ${selected || "Item daftar"}\n`,
      ol: `\n1. ${selected || "Item daftar"}\n`,
    };

    const before = konten.slice(0, start);
    const after = konten.slice(end);
    setKonten(before + formats[action] + after);
    setTimeout(() => textarea.focus(), 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setSavedAt(now);
    setIsSaving(false);
    onSave?.(judul, konten);
  };

  const renderPratinjau = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^## (.*$)/gm, "<h2 class='text-lg font-bold text-gray-800 mt-4 mb-2'>$1</h2>")
      .replace(/^> (.*$)/gm, "<blockquote class='border-l-4 border-[#5CB85C] pl-4 text-gray-500 italic my-2'>$1</blockquote>")
      .replace(/^- (.*$)/gm, "<li class='ml-4 list-disc text-gray-700'>$1</li>")
      .replace(/^1\. (.*$)/gm, "<li class='ml-4 list-decimal text-gray-700'>$1</li>")
      .replace(/\n/g, "<br/>");
  };

  const toolbarButtons: { action: FormatAction; label: string; icon: string }[] = [
    { action: "bold", label: "Bold", icon: "B" },
    { action: "italic", label: "Italic", icon: "I" },
    { action: "heading", label: "Heading", icon: "H2" },
    { action: "quote", label: "Kutipan", icon: "❝" },
    { action: "ul", label: "Bullet List", icon: "•—" },
    { action: "ol", label: "Numbered List", icon: "1." },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.action}
              onClick={() => handleFormat(btn.action)}
              title={btn.label}
              className="w-8 h-8 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all flex items-center justify-center"
            >
              {btn.icon}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["tulis", "pratinjau"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                tab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Judul */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-50">
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul artikel..."
          className="w-full text-xl font-bold text-gray-800 bg-transparent focus:outline-none placeholder-gray-200"
        />
      </div>

      {/* Editor / Pratinjau */}
      <div className="flex-1 px-5 py-4 min-h-[360px]">
        {tab === "tulis" ? (
          <textarea
            id="artikel-editor"
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            placeholder="Mulai menulis artikel di sini, atau generate dengan AI dari panel di samping..."
            className="w-full h-full min-h-[340px] text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-300 resize-none leading-relaxed"
          />
        ) : (
          <div
            className="text-sm text-gray-700 leading-relaxed min-h-[340px]"
            dangerouslySetInnerHTML={{ __html: renderPratinjau(konten) || "<p class='text-gray-300'>Belum ada konten untuk ditampilkan.</p>" }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{wordCount} kata</span>
          <span className="text-xs text-gray-400">{charCount} karakter</span>
          <span className="text-xs text-gray-400">~{readTime} menit baca</span>
          {savedAt && <span className="text-xs text-green-500">✓ Disimpan {savedAt}</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || (!judul && !konten)}
          className="flex items-center gap-2 px-5 py-2 bg-[#5CB85C] hover:bg-[#4cae4c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
        >
          {isSaving ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          )}
          Simpan
        </button>
      </div>
    </div>
  );
}