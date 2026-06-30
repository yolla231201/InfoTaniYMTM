"use client";
import { useState } from "react";
import { getDriveThumbUrl } from "@/lib/driveUtils";

interface PilihFotoUtamaProps {
  fotoList: string[];
  selected: string | null;
  onSelect: (url: string) => void;
}

export default function PilihFotoUtama({ fotoList, selected, onSelect }: PilihFotoUtamaProps) {
  if (fotoList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Foto Utama</p>
        <p className="text-sm text-gray-400">Kiriman ini tidak punya foto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
        Foto Utama <span className="text-gray-300 font-normal normal-case">(featured image)</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {fotoList.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(url)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              selected === url ? "border-[#5CB85C]" : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <img src={getDriveThumbUrl(url)} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            {selected === url && (
              <div className="absolute inset-0 bg-[#5CB85C]/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#5CB85C] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      {!selected && (
        <p className="text-xs text-amber-500 mt-3">Pilih 1 foto sebagai foto utama artikel.</p>
      )}
    </div>
  );
}