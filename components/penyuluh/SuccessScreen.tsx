import { useEffect, useState } from "react";

interface SuccessScreenProps {
  onReset: () => void;
}

export default function SuccessScreen({ onReset }: SuccessScreenProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      onReset();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onReset]);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-[#5CB85C]/10 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#5CB85C] flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800">Narasi Berhasil Dikirim!</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          Terima kasih! Laporan Anda sudah kami terima dan akan segera diproses oleh tim IT menjadi konten.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 text-sm text-green-700 max-w-sm">
        <p className="font-semibold mb-1">Apa yang terjadi selanjutnya?</p>
        <ul className="text-left list-disc list-inside space-y-1 text-green-600">
          <li>Tim IT akan meninjau narasi Anda</li>
          <li>Konten berita / artikel akan dibuat</li>
          <li>Video untuk YouTube, IG, TikTok disiapkan</li>
        </ul>
      </div>

      <p className="text-sm text-gray-400">
        Otomatis kembali dalam <span className="font-semibold text-[#5CB85C]">{countdown}</span> detik...
      </p>

      <button
        onClick={onReset}
        className="mt-2 bg-[#5CB85C] hover:bg-[#4cae4c] text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm"
      >
        Kirim Narasi Baru
      </button>
    </div>
  );
}