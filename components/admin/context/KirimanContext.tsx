"use client";
// Jadi:
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Kiriman, StatusOutput } from "../mockData";


interface KirimanContextValue {
  kirimanList: Kiriman[];
  isLoading: boolean;
  error: string | null;
  getKiriman: (id: string) => Kiriman | undefined;
  updateKiriman: (id: string, partial: Partial<Kiriman>) => void;
}

const KirimanContext = createContext<KirimanContextValue | undefined>(undefined);

export function KirimanProvider({ children }: { children: ReactNode }) {
  // clone supaya tidak memutasi mockKiriman asli (modul asal) secara langsung
  // Jadi:
  const [kirimanList, setKirimanList] = useState<Kiriman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/kiriman")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          // Jadi:
          setKirimanList(result.data.map((k: any) => ({
            ...k,
            status: k.statusNarasi ?? "baru",
            media: [],
            mediaCount: 0,
            outputStatus: {
              artikel: (k.outputStatus?.artikel ?? "Belum").toLowerCase() as StatusOutput,
              facebook: (k.outputStatus?.facebook ?? "Belum").toLowerCase() as StatusOutput,
              facebookReels: (k.outputStatus?.facebookReels ?? "Belum").toLowerCase() as StatusOutput,
              instagram: (k.outputStatus?.instagram ?? "Belum").toLowerCase() as StatusOutput,
              tiktokFoto: (k.outputStatus?.tiktokFoto ?? "Belum").toLowerCase() as StatusOutput,
              tiktokVideo: (k.outputStatus?.tiktokVideo ?? "Belum").toLowerCase() as StatusOutput,
              instagramReels: (k.outputStatus?.instagramReels ?? "Belum").toLowerCase() as StatusOutput,
              youtubeShorts: (k.outputStatus?.youtubeShorts ?? "Belum").toLowerCase() as StatusOutput,
            },
          })));
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const getKiriman = (id: string) => kirimanList.find((k) => k.id === id);

  const updateKiriman = (id: string, partial: Partial<Kiriman>) => {
    // Update state lokal dulu (optimistic)
    setKirimanList((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
            ...k,
            ...partial,
            outputStatus: partial.outputStatus
              ? { ...k.outputStatus, ...partial.outputStatus }
              : k.outputStatus,
          }
          : k
      )
    );

    // Kirim ke Spreadsheet
    const updates: Record<string, string> = {};
    if (partial.status) updates.statusNarasi = partial.status;
    if (partial.outputStatus) {
      Object.entries(partial.outputStatus).forEach(([key, val]) => {
        updates[key] = (val as string).charAt(0).toUpperCase() + (val as string).slice(1);
      });
    }

    if (Object.keys(updates).length > 0) {
      fetch("/api/admin/kiriman/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      }).catch((err) => console.error("[updateKiriman error]", err));
    }
  };

  return (
    <KirimanContext.Provider value={{ kirimanList, isLoading, error, getKiriman, updateKiriman }}>
      {children}
    </KirimanContext.Provider>
  );
}

export function useKiriman() {
  const ctx = useContext(KirimanContext);
  if (!ctx) {
    throw new Error("useKiriman harus dipakai di dalam <KirimanProvider>");
  }
  return ctx;
}