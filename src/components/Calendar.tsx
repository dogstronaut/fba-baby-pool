"use client";

import { DUE_DATE } from "@/lib/constants";
import type { Entry } from "@/lib/db";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDateKey(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function Calendar({
  year,
  month,
  entries,
  selectedDate,
  onSelect,
}: {
  year: number;
  month: number;
  entries: Entry[];
  selectedDate: string | null;
  onSelect: (dateKey: string) => void;
}) {
  const takenByDate = new Map(
    entries.map((e) => [e.guess_date.slice(0, 10), e.name])
  );

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-center text-lg font-bold text-slate-800">
        {MONTH_NAMES[month]} {year}
      </h3>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;

          const dateKey = toDateKey(year, month, day);
          const takenBy = takenByDate.get(dateKey);
          const isSelected = selectedDate === dateKey;
          const isDueDate =
            year === DUE_DATE.getFullYear() &&
            month === DUE_DATE.getMonth() &&
            day === DUE_DATE.getDate();

          const base =
            "aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition";

          if (takenBy) {
            return (
              <div
                key={idx}
                title={`Taken by ${takenBy}`}
                className={`${base} cursor-not-allowed bg-slate-100 text-slate-400`}
              >
                <span>{day}</span>
                <span className="max-w-full truncate px-0.5 text-[9px] leading-none">
                  {takenBy}
                </span>
              </div>
            );
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelect(dateKey)}
              className={`${base} cursor-pointer border ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white font-bold"
                  : isDueDate
                  ? "border-amber-400 bg-amber-50 text-slate-800 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-300"
              }`}
            >
              <span>{day}</span>
              {isDueDate && !isSelected && (
                <span className="text-[8px] font-semibold text-amber-600">
                  DUE DATE
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
