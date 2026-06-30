import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="h-dvh overflow-hidden bg-[#5CB85C] flex flex-col">

      {/* Navbar */}
      <nav className="px-4 py-3 sm:px-8 sm:py-5 flex items-center gap-2">
        <span className="text-white font-bold text-lg tracking-tight">InfoTani</span>
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L8 8H4l4 6H5l7 8 7-8h-3l4-6h-4L12 2z" />
        </svg>
        <div className="ml-1 h-px w-8 bg-white/60" />
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center px-4 py-4 sm:px-8 sm:py-8 lg:px-24">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

          {/* Left — Logo & Brand */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            {/* MTM Logo (SVG illustration) */}
            <div className="flex justify-center w-full">
              <Image
                src="/images/logo-ymtm-putih.png"
                alt="Logo MTM"
                width={140}
                height={140}
                className="object-contain sm:w-[180px] md:w-[240px] lg:w-[300px] h-auto"
              />
            </div>

            <div className="text-center lg:text-center">
              <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-5xl leading-tight">
                Yayasan Mitra
                Tani Mandiri
              </h1>
            </div>
          </div>

          {/* Right — Info Card */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-xl max-w-md mx-auto lg:mx-0">
            <div className="flex flex-col gap-3 sm:gap-5">
              <div className="bg-[#f0faf0] rounded-2xl px-5 py-4 border border-[#5CB85C]/20">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-[#5CB85C]">"</span>Selamat datang, Penyuluh! Platform ini membantu Anda menyampaikan laporan kegiatan lapangan dengan mudah dan cepat.<span className="font-semibold text-[#5CB85C]">"</span>
                </p>
              </div>
              <div className="bg-[#f0faf0] rounded-2xl px-5 py-4 border border-[#5CB85C]/20">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-[#5CB85C]">"</span>Ceritakan kegiatan Anda di lapangan, kami yang akan mengubahnya menjadi konten berita, artikel, dan video untuk website serta media sosial.<span className="font-semibold text-[#5CB85C]">"</span>
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/penyuluh"
                className="mt-2 flex items-center justify-center gap-2 bg-[#5CB85C] hover:bg-[#4cae4c] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 active:scale-95 shadow-md group"
              >
                <span>Mulai Laporan</span>
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 text-center">
        <p className="text-white/50 text-xs">© 2026 Yayasan Mitra Tani Mandiri</p>
      </div>
    </main>
  );
}