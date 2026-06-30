import { Suspense } from "react";
import VideoContent from "@/components/admin/video/VideoContent";

export default function ArtikelPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Memuat...</div>}>
      <VideoContent />
    </Suspense>
  );
}