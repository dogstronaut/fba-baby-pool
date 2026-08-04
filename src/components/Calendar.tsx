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
    <div className="overflow-hidden rounded-md border border-[var(--line)] bg-white shadow-md">
      <div className="bg-[var(--navy)] px-4 py-2 text-center font-mono text-xs font-bold uppercase tracking-widest text-[var(--cream)]">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--line)] px-px pt-px">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="bg-[var(--navy)] py-1 text-center font-mono text-[10px] font-semibold uppercase text-[var(--cream)]/70"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--line)] p-px">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} className="bg-[var(--cream)]" />;

          const dateKey = toDateKey(year, month, day);
          const names = namesByDate.get(dateKey) ?? [];
          const isSelected = selectedDate === dateKey;
          const isDueDate =
            year === DUE_DATE.getFullYear() &&
            month === DUE_DATE.getMonth() &&
            day === DUE_DATE.getDate();

          const base =
            "relative aspect-square text-sm flex flex-col items-center justify-center gap-0.5 transition cursor-pointer font-mono border";

          let style = "border-transparent bg-white text-[var(--navy)] hover:bg-[var(--cream-deep)]";
          if (isSelected) {
            style = "border-transparent bg-[var(--stamp)] text-white font-bold";
          } else if (isDueDate) {
            style = "border-[var(--gold)] bg-[var(--vault-soft)] text-[var(--navy)] hover:bg-[var(--vault-soft)]/70";
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
                <span className="text-[8px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Due
                </span>
              )}
              {names.length > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                    isSelected
                      ? "bg-[var(--navy)] text-[var(--cream)]"
                      : "bg-[var(--navy)] text-[var(--cream)]"
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
