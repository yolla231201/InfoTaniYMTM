"use client";
import { useState } from "react";
import StepIndicator from "@/components/penyuluh/StepIndicator";
import StepIdentitas from "@/components/penyuluh/StepIdentitas";
import StepNarasi from "@/components/penyuluh/StepNarasi";
import StepUpload from "@/components/penyuluh/StepUpload";
import SuccessScreen from "@/components/penyuluh/SuccessScreen";
import { PenyuluhFormData, initialFormData } from "@/components/types";

export default function PenyuluhPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PenyuluhFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: keyof PenyuluhFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (files: { name: string; size: number; type: string; file: File | null; link?: string }[]) => {
    setIsSubmitting(true);
    try {
      // Konversi file ke base64
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      const foto = [];
      const video = [];

      // Jadi:
      for (const f of files) {
        if (f.type === "video/link") {
          video.push({ nama: f.name, link: f.link });
        } else if (f.type.startsWith("image/") && f.file) {
          const data = await toBase64(f.file);
          foto.push({ nama: f.name, type: f.type, data });
        }
      }

      const response = await fetch("/api/penyuluh/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, foto, video }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData(initialFormData);
    setIsSuccess(false);
  };

  const stepTitles: Record<number, string> = {
    1: "Data Diri",
    2: "Isi Narasi",
    3: "Upload Media",
  };

  return (
    <div className="min-h-screen bg-[#e8f5e2] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5CB85C]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#5CB85C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800">Narasi Lapangan</h1>
              <p className="text-xs text-gray-500">Bagikan Cerita Anda, Untuk diolah menjadi Konten</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {isSuccess ? (
            <SuccessScreen onReset={handleReset} />
          ) : (
            <>
              {/* Step Indicator */}
              <StepIndicator currentStep={step} totalSteps={3} />

              {/* Step label */}
              <p className="text-xs text-gray-400 mb-5">
                Langkah {step} dari 3 &mdash; <span className="font-semibold text-gray-500">{stepTitles[step]}</span>
              </p>

              {/* Step Content */}
              {step === 1 && (
                <StepIdentitas
                  data={formData}
                  onChange={handleChange}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <StepNarasi
                  data={formData}
                  onChange={handleChange}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepUpload
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}