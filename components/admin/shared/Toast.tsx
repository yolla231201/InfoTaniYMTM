"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "warning" | "error";

interface ToastProps {
  type: ToastType;
  message: string;
  duration: number; // dalam detik
  show: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const typeConfig: Record<
  ToastType,
  { bg: string; border: string; text: string; bar: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    bar: "bg-green-500",
    icon: (
      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    bar: "bg-amber-500",
    icon: (
      <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M10.29 3.86L1.82 18a1.5 1.5 0 001.3 2.25h17.76a1.5 1.5 0 001.3-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    bar: "bg-red-500",
    icon: (
      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
};

export default function Toast({ type, message, duration, show, onClose, onComplete }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(100);

  useEffect(() => {
    if (!show) return;

    // trigger slide-in di frame berikutnya (supaya transition jalan)
    setVisible(false);
    setBarWidth(100);
    const showFrame = requestAnimationFrame(() => {
      setVisible(true);
      requestAnimationFrame(() => setBarWidth(0));
    });

    const completeTimer = setTimeout(() => {
      onComplete?.();
      setVisible(false);
      // tunggu animasi slide-out selesai (300ms) sebelum benar-benar unmount
      setTimeout(onClose, 300);
    }, duration * 1000);

    return () => {
      cancelAnimationFrame(showFrame);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, duration]);

  const handleManualClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!show) return null;

  const cfg = typeConfig[type];

  return (
    <div
      className={`fixed top-5 right-5 z-[100] w-80 max-w-[calc(100vw-2.5rem)] transition-all duration-300 ease-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`relative overflow-hidden rounded-2xl border shadow-lg ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start gap-3 px-4 py-3.5">
          {cfg.icon}
          <p className={`text-sm font-medium leading-snug ${cfg.text}`}>{message}</p>
          <button
            onClick={handleManualClose}
            className={`ml-auto shrink-0 ${cfg.text} opacity-50 hover:opacity-100 transition-opacity`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Progress bar / indikator detik */}
        <div className="h-1 w-full bg-black/5">
          <div
            className={`h-full ${cfg.bar} transition-all ease-linear`}
            style={{ width: `${barWidth}%`, transitionDuration: `${duration}s` }}
          />
        </div>
      </div>
    </div>
  );
}