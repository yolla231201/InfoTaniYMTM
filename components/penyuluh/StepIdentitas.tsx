import { PenyuluhFormData } from "../types";

interface StepIdentitasProps {
  data: PenyuluhFormData;
  onChange: (field: keyof PenyuluhFormData, value: string) => void;
  onNext: () => void;
}

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5CB85C]/40 focus:border-[#5CB85C] transition placeholder-gray-300";

export default function StepIdentitas({ data, onChange, onNext }: StepIdentitasProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama lengkap</label>
        <input
          type="text"
          required
          placeholder="Masukkan nama lengkap Anda"
          value={data.namaLengkap}
          onChange={(e) => onChange("namaLengkap", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Wilayah */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Wilayah / lokasi tugas</label>
        <input
          type="text"
          required
          placeholder="Contoh: Kecamatan Sukamaju, Kab. Bogor"
          value={data.wilayah}
          onChange={(e) => onChange("wilayah", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Nomor HP & Tanggal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Nomor HP</label>
          <input
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            value={data.nomorHP}
            onChange={(e) => onChange("nomorHP", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal Kegiatan</label>
          <input
            type="date"
            required
            value={data.tanggalKegiatan}
            onChange={(e) => onChange("tanggalKegiatan", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Lokasi & Kategori */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Lokasi Kegiatan</label>
          <input
            type="text"
            required
            placeholder="Nama desa / kelurahan"
            value={data.lokasiKegiatan}
            onChange={(e) => onChange("lokasiKegiatan", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Kategori kegiatan</label>
          <select
            required
            value={data.kategoriKegiatan}
            onChange={(e) => onChange("kategoriKegiatan", e.target.value)}
            className={inputClass}
          >
            <option value="">Pilih kategori</option>
            <option value="penyuluhan">Penyuluhan Pertanian</option>
            <option value="pelatihan">Pelatihan Petani</option>
            <option value="kunjungan">Kunjungan Lapangan</option>
            <option value="demonstrasi">Demonstrasi Plot</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
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