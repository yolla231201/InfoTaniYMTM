import { PenyuluhFormData } from "../types";

interface StepNarasiProps {
  data: PenyuluhFormData;
  onChange: (field: keyof PenyuluhFormData , value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition placeholder-gray-300";

export default function StepNarasi({ data, onChange, onNext, onBack }: StepNarasiProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Judul */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Judul Kegiatan</label>
        <input
          type="text"
          required
          placeholder="Contoh: Penyuluhan Penggunaan Pupuk Organik di Desa Sari"
          value={data.judulKegiatan}
          onChange={(e) => onChange("judulKegiatan", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Isi Cerita */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Isi Cerita</label>
        <textarea
          required
          rows={10}
          placeholder="Ceritakan kegiatan Anda di lapangan secara detail. Apa yang dilakukan, siapa yang hadir, bagaimana hasilnya..."
          value={data.isiCerita}
          onChange={(e) => onChange("isiCerita", e.target.value)}
          className={`${inputClass} resize-none`}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{data.isiCerita.length} karakter</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold px-7 py-3 rounded-2xl transition-all duration-200 active:scale-95"
        >
          Sebelumnya
        </button>
        <button
          type="submit"
          className="bg-[#5CB85C] hover:bg-[#4cae4c] text-white font-semibold px-7 py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm"
        >
          Selanjutnya
        </button>
      </div>
    </form>
  );
}