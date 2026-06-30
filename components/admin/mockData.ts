export type StatusKiriman = "baru" | "draft" | "arsip";
export type StatusOutput = "belum" | "proses" | "tayang";

// Jadi:
export interface OutputStatus {
  artikel: StatusOutput;
  facebook: StatusOutput;
  instagram: StatusOutput;
  tiktokFoto: StatusOutput;
  tiktokVideo: StatusOutput;
  instagramReels: StatusOutput;
  facebookReels: StatusOutput;
  youtubeShorts: StatusOutput;
}

export interface MediaFile {
  id: string;
  nama: string;
  tipe: "foto" | "video";
  url: string; // Google Drive link
  ukuran: string;
}

export interface Kiriman {
  id: string;
  namaLengkap: string;
  wilayah: string;
  nomorHP: string;
  tanggalKegiatan: string;
  lokasiKegiatan: string;
  kategoriKegiatan: string;
  judulKegiatan: string;
  isiCerita: string;
  status: StatusKiriman;
  tanggalMasuk: string;
  media: MediaFile[];
  linkFoto?: string;
  linkVideo?: string;
  outputStatus: OutputStatus;
}



export const statusLabel: Record<StatusKiriman, string> = {
  baru: "Baru",
  draft: "Draft",
  arsip: "Arsip",
};

export const statusColor: Record<StatusKiriman, string> = {
  baru: "bg-blue-50 text-blue-600 border-blue-200",
  draft: "bg-amber-50 text-amber-600 border-amber-200",
  arsip: "bg-gray-100 text-gray-500 border-gray-200",
};

export const outputStatusColor: Record<StatusOutput, string> = {
  belum: "bg-gray-100 text-gray-400",
  proses: "bg-amber-50 text-amber-600",
  tayang: "bg-green-50 text-green-600",
};

export const outputStatusLabel: Record<StatusOutput, string> = {
  belum: "Belum",
  proses: "Proses",
  tayang: "Tayang",
};

export const kategoriLabel: Record<string, string> = {
  penyuluhan: "Penyuluhan Pertanian",
  pelatihan: "Pelatihan Petani",
  kunjungan: "Kunjungan Lapangan",
  demonstrasi: "Demonstrasi Plot",
  lainnya: "Lainnya",
};

// Helper: apakah kiriman punya video
export const hasVideo = (kiriman: Kiriman) => !!kiriman.linkVideo && kiriman.linkVideo.trim() !== "";
export const hasPhoto = (kiriman: Kiriman) => !!kiriman.linkFoto && kiriman.linkFoto.trim() !== "";
export const fotoCount = (kiriman: Kiriman) => kiriman.media.filter((m) => m.tipe === "foto").length;
export const videoCount = (kiriman: Kiriman) => kiriman.media.filter((m) => m.tipe === "video").length;