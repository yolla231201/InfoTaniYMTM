export interface PenyuluhFormData {
  // Step 1 - Identitas
  namaLengkap: string;
  wilayah: string;
  nomorHP: string;
  tanggalKegiatan: string;
  lokasiKegiatan: string;
  kategoriKegiatan: string;
  // Step 2 - Narasi
  judulKegiatan: string;
  isiCerita: string;
}

export const initialFormData: PenyuluhFormData = {
  namaLengkap: "",
  wilayah: "",
  nomorHP: "",
  tanggalKegiatan: "",
  lokasiKegiatan: "",
  kategoriKegiatan: "",
  judulKegiatan: "",
  isiCerita: "",
};