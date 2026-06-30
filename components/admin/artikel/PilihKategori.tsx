"use client";
import { useEffect, useState } from "react";

interface WPCategory {
  id: number;
  name: string;
  count: number;
}

interface PilihKategoriProps {
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function PilihKategori({ selected, onSelect }: PilihKategoriProps) {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/wordpress/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          setError(data.error || "Gagal memuat kategori.");
        }
      } catch {
        setError("Gagal terhubung ke server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Kategori Artikel</p>

      {isLoading && (
        <p className="text-sm text-gray-400">Memuat kategori...</p>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>
      )}

      {!isLoading && !error && (
        <select
          value={selected ?? ""}
          onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
