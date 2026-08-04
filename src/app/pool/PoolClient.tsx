"use client";

import { useEffect, useState, useCallback } from "react";
import Calendar from "@/components/Calendar";
import EntryForm from "@/components/EntryForm";
import type { Entry } from "@/lib/db";
import { CALENDAR_MONTHS, WINNER_PRIZE, CLASS_NAME } from "@/lib/constants";

export default function PoolClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/entries", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setLoadError(
          "Couldn't load entries. The database may not be connected yet."
        );
        setEntries([]);
        return;
      }
      setLoadError(null);
      setEntries(data.entries || []);
    } catch {
      setLoadError("Couldn't reach the server. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#c99b3d]">
          {CLASS_NAME}
        </p>
        <h1 className="font-serif text-3xl font-extrabold text-[#12233f]">
          Guess the Baby&apos;s Birthday
        </h1>
        <p className="mt-2 text-[#12233f]/70">
          Pick a date, guess the eye color, hair color, and weight. More than
          one person can pick the same date — winner takes home{" "}
          <strong>${WINNER_PRIZE}</strong>, the rest goes to the class
          budget.
        </p>
      </div>

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {CALENDAR_MONTHS.map(({ year, month }) => (
          <Calendar
            key={`${year}-${month}`}
            year={year}
            month={month}
            entries={entries}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        ))}
      </div>

      <EntryForm
        selectedDate={selectedDate}
        onSuccess={() => {
          setSelectedDate(null);
          loadEntries();
        }}
      />

      <div>
        <h2 className="mb-3 font-serif text-xl font-bold text-[#12233f]">
          Current Guesses {loading ? "" : `(${entries.length})`}
        </h2>
        <div className="overflow-x-auto rounded-2xl border-2 border-[#12233f]/15 bg-[#fffdf7] shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-[#12233f] text-left text-[#f2ead6]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date Guess</th>
                <th className="px-4 py-2">Eyes</th>
                <th className="px-4 py-2">Hair</th>
                <th className="px-4 py-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-[#12233f]/10">
                  <td className="px-4 py-2 font-medium text-[#12233f]">
                    {e.name}
                  </td>
                  <td className="px-4 py-2 text-[#12233f]/70">
                    {new Date(e.guess_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </td>
                  <td className="px-4 py-2 text-[#12233f]/70">{e.eye_color}</td>
                  <td className="px-4 py-2 text-[#12233f]/70">{e.hair_color}</td>
                  <td className="px-4 py-2 text-[#12233f]/70">
                    {e.weight_lbs} lbs {e.weight_oz} oz
                  </td>
                </tr>
              ))}
              {!loading && entries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[#12233f]/40"
                  >
                    No guesses yet — be the first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
