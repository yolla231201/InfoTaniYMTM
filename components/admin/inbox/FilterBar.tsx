"use client";
import { StatusKiriman } from "../mockData";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  status: StatusKiriman | "semua";
  onStatus: (v: StatusKiriman | "semua") => void;
  kategori: string;
  onKategori: (v: string) => void;
}

const statusOptions: { value: StatusKiriman | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "baru", label: "Baru" },
  { value: "draft", label: "Draft" },
];

const kategoriOptions = [
  { value: "semua", label: "Semua Kategori" },
  { value: "penyuluhan", label: "Penyuluhan" },
  { value: "pelatihan", label: "Pelatihan" },
  { value: "kunjungan", label: "Kunjungan" },
  { value: "demonstrasi", label: "Demonstrasi" },
  { value: "lainnya", label: "Lainnya" },
];

export default function FilterBar({ search, onSearch, status, onStatus, kategori, onKategori }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Cari judul atau nama penyuluh..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition placeholder-gray-300"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatus(opt.value)}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all duration-150 ${
              status === opt.value
                ? "bg-[#5CB85C] text-white border-[#5CB85C]"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#5CB85C]/40 hover:text-[#5CB85C]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Kategori */}
      <select
        value={kategori}
        onChange={(e) => onKategori(e.target.value)}
        className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition"
      >
        {kategoriOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}