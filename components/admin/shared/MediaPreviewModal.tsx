"use client";
import { useEffect } from "react";
import { getDriveThumbUrl, getDriveEmbedUrl } from "@/lib/driveUtils";

interface MediaPreviewModalProps {
  url: string;
  type: "foto" | "video";
  onClose: () => void;
}

export default function MediaPreviewModal({ url, type, onClose }: MediaPreviewModalProps) {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Tombol X */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Konten modal — stop propagation agar klik konten tidak tutup modal */}
      <div
        className="max-w-3xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "foto" ? (
          <img
            src={getDriveThumbUrl(url, 1200)}
            alt="Preview foto"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <iframe
              src={getDriveEmbedUrl(url)}
              className="w-full h-full"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}