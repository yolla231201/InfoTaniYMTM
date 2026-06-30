import { Suspense } from "react";
import ArtikelContent from "@/components/admin/artikel/ArtikelContent";

export default function ArtikelPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Memuat...</div>}>
      <ArtikelContent />
    </Suspense>
  );
}