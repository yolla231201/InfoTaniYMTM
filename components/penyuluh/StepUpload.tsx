"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

// Jadi:
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File | null;
  link?: string; // hanya untuk video
}

interface StepUploadProps {
  onBack: () => void;
  onSubmit: (files: UploadedFile[]) => void;
  isSubmitting?: boolean;
}

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEOS = 5;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StepUpload({ onBack, onSubmit, isSubmitting }: StepUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoLinks, setVideoLinks] = useState<{ id: string; link: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = (newFiles: FileList | File[]) => {
    setError(null);
    const fileArr = Array.from(newFiles);
    const photos = files.filter((f) => f.type.startsWith("image/"));
    const added: UploadedFile[] = [];

    for (const file of fileArr) {
      const isPhoto = file.type.startsWith("image/");

      if (!isPhoto) {
  setError("Hanya file gambar yang diperbolehkan.");
  continue;
}
      if (isPhoto) {
        if (photos.length + added.filter((f) => f.type.startsWith("image/")).length >= MAX_PHOTOS) {
          setError(`Maksimal ${MAX_PHOTOS} foto.`);
          continue;
        }
        if (file.size > MAX_PHOTO_SIZE) {
          setError(`${file.name} melebihi batas 5MB per foto.`);
          continue;
        }
      }
      added.push({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, file });
    }
    setFiles((prev) => [...prev, ...added]);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndAdd(e.target.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Jadi:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoFiles = videoLinks
      .filter((v) => v.link.trim() !== "")
      .map((v) => ({ id: v.id, name: v.link, size: 0, type: "video/link", file: null, link: v.link }));
    onSubmit([...files, ...videoFiles]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Upload Area */}
      {/* Upload Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Upload Foto</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
      border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
      ${isDragging ? "border-[#5CB85C] bg-[#5CB85C]/5" : "border-gray-200 bg-gray-50 hover:border-[#5CB85C]/50 hover:bg-[#5CB85C]/5"}
    `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-semibold text-gray-600">Pilih foto atau seret &amp; lepas di sini</p>
          <p className="text-xs text-gray-400 mt-1">Maks. {MAX_PHOTOS} foto &bull; 5MB per file</p>
          <button type="button" className="mt-4 px-5 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition">
            Telusuri Berkas
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* List Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          List foto <span className="text-gray-400">({files.length} file)</span>
        </label>
        {files.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-300 text-sm">
            Belum ada foto dipilih
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 4.5h15A2.25 2.25 0 0121.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0 ml-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Video */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Link Video Google Drive</label>
        <p className="text-xs text-gray-400 mb-2">Upload video ke Google Drive terlebih dahulu, lalu paste link-nya di sini. Maks. {MAX_VIDEOS} video.</p>
        <div className="flex flex-col gap-2">
          {videoLinks.map((v) => (
            <div key={v.id} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={v.link}
                onChange={(e) => setVideoLinks((prev) => prev.map((x) => x.id === v.id ? { ...x, link: e.target.value } : x))}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition"
              />
              <button type="button" onClick={() => setVideoLinks((prev) => prev.filter((x) => x.id !== v.id))} className="text-gray-400 hover:text-red-500 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {videoLinks.length < MAX_VIDEOS && (
            <button
              type="button"
              onClick={() => setVideoLinks((prev) => [...prev, { id: crypto.randomUUID(), link: "" }])}
              className="flex items-center gap-2 text-sm text-[#5CB85C] hover:text-[#4cae4c] font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah link video
            </button>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold px-7 py-3 rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#5CB85C] hover:bg-[#4cae4c] text-white font-semibold px-7 py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              Kirim
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}