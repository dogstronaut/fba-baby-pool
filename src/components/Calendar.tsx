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
  const namesByDate = new Map<string, string[]>();
  for (const e of entries) {
    const key = e.guess_date.slice(0, 10);
    const list = namesByDate.get(key) ?? [];
    list.push(e.name);
    namesByDate.set(key, list);
  }

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border-2 border-[#12233f]/15 bg-[#fffdf7] p-4 shadow-md">
      <h3 className="mb-3 text-center font-serif text-lg font-bold tracking-wide text-[#12233f]">
        {MONTH_NAMES[month]} {year}
      </h3>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#12233f]/40">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;

          const dateKey = toDateKey(year, month, day);
          const names = namesByDate.get(dateKey) ?? [];
          const isSelected = selectedDate === dateKey;
          const isDueDate =
            year === DUE_DATE.getFullYear() &&
            month === DUE_DATE.getMonth() &&
            day === DUE_DATE.getDate();

          const base =
            "relative aspect-square rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition cursor-pointer border";

          let style =
            "border-[#12233f]/15 bg-white text-[#12233f] hover:bg-[#c99b3d]/10 hover:border-[#c99b3d]";
          if (isSelected) {
            style = "border-[#c99b3d] bg-[#12233f] text-[#f2ead6] font-bold";
          } else if (isDueDate) {
            style = "border-[#c99b3d] bg-[#f7ecc9] text-[#12233f] hover:bg-[#f0dfa0]";
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => onSelect(dateKey)}
              title={names.length ? `Guessed by: ${names.join(", ")}` : undefined}
              className={`${base} ${style}`}
            >
              <span>{day}</span>
              {isDueDate && !isSelected && (
                <span className="text-[8px] font-semibold text-[#8a6a1f]">
                  DUE DATE
                </span>
              )}
              {names.length > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                    isSelected
                      ? "bg-[#c99b3d] text-[#12233f]"
                      : "bg-[#12233f] text-[#f2ead6]"
                  }`}
                >
                  {names.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
