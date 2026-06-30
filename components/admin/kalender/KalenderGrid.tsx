"use client";
import { useState } from "react";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export type KalenderEvent = {
  label: string;
  type: "artikel" | "video" | "sosmed";
};

const typeColor: Record<string, string> = {
  artikel: "bg-[#5CB85C]/10 text-[#5CB85C] border-[#5CB85C]/20",
  video: "bg-purple-100 text-purple-600 border-purple-200",
  sosmed: "bg-blue-100 text-blue-600 border-blue-200",
};

interface KalenderGridProps {
  events: Record<string, KalenderEvent[]>;
  onSelectDate?: (date: string, events: KalenderEvent[]) => void;
  onAddEvent?: (date: string) => void;
}

export default function KalenderGrid({ events, onSelectDate, onAddEvent }: KalenderGridProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const dateKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleSelect = (key: string) => {
    const next = selected === key ? null : key;
    setSelected(next);
    if (next) onSelectDate?.(next, events[next] ?? []);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Header navigasi bulan */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-800">{MONTHS[month]} {year}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {Object.values(events).flat().length} konten dijadwalkan bulan ini
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
            className="px-3 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs text-gray-500 font-medium transition-colors"
          >
            Hari ini
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nama hari */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-2">{d}</div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = dateKey(day);
          const dayEvents = events[key] ?? [];
          const isToday = key === todayKey;
          const isSelected = selected === key;
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day}
              onClick={() => handleSelect(key)}
              className={`min-h-[72px] rounded-xl p-1.5 cursor-pointer border transition-all duration-150 ${
                isSelected
                  ? "border-[#5CB85C] bg-[#5CB85C]/5 shadow-sm"
                  : hasEvents
                  ? "border-gray-100 hover:border-[#5CB85C]/40 bg-white hover:shadow-sm"
                  : "border-transparent hover:bg-gray-50 bg-white"
              }`}
            >
              {/* Nomor hari */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-[#5CB85C] text-white" : "text-gray-600"
                }`}>
                  {day}
                </span>
                {hasEvents && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddEvent?.(key); }}
                    className="w-4 h-4 rounded-full bg-gray-100 hover:bg-[#5CB85C]/20 text-gray-400 hover:text-[#5CB85C] flex items-center justify-center text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100"
                  >
                    +
                  </button>
                )}
              </div>

              {/* Events */}
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((ev, j) => (
                  <span
                    key={j}
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium truncate border ${typeColor[ev.type]}`}
                  >
                    {ev.label}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-gray-400 pl-1">+{dayEvents.length - 2} lagi</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        {Object.entries(typeColor).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${cls}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}