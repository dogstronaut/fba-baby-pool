"use client";

import { useEffect, useState, useCallback } from "react";
import Calendar from "@/components/Calendar";
import EntryForm from "@/components/EntryForm";
import type { Entry } from "@/lib/db";
import {
  BUY_IN_AMOUNT,
  CALENDAR_MONTHS,
  CLASS_NAME,
  VENMO_HANDLE,
  WINNER_PRIZE,
} from "@/lib/constants";

const RULES = [
  {
    label: "01",
    title: "Guess the Details",
    body: "Pick a date on the calendar, then guess eye color, hair color, and birth weight. Multiple people may guess the same date.",
  },
  {
    label: "02",
    title: "Send the Buy-In",
    body: `Venmo $${BUY_IN_AMOUNT} to ${VENMO_HANDLE} and check the confirmation box — your guess isn't locked in until payment is sent.`,
  },
  {
    label: "03",
    title: "Collect the Prize",
    body: `Closest guess wins $${WINNER_PRIZE} once baby arrives. The rest goes to the ${CLASS_NAME} fund.`,
  },
];

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
        <p className="mono-eyebrow mb-1">&mdash; {CLASS_NAME} &mdash;</p>
        <h1 className="font-serif text-3xl font-extrabold italic text-[var(--navy)]">
          Guess the Baby&apos;s Birthday
        </h1>
        <p className="mt-2 text-[var(--navy)]/70">
          Pick a date, guess the eye color, hair color, and weight. More than
          one person can pick the same date — winner takes home{" "}
          <strong>${WINNER_PRIZE}</strong>, the rest goes to the class
          budget.
        </p>
      </div>

      {loadError && (
        <p className="rounded bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {loadError}
        </p>
      )}

      <section className="relative">
        <span className="exhibit-tab">Exhibit B</span>
        <div className="ledger-card">
        <div className="p-6 pl-8 sm:p-8 sm:pl-10">
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
        </div>
        </div>
      </section>

      <section className="relative">
        <span className="exhibit-tab">Exhibit C</span>
        <div className="ledger-card">
        <div className="p-6 pl-8 sm:p-8 sm:pl-10">
          <h2 className="mb-4 font-serif text-xl font-bold italic text-[var(--navy)]">
            The Rules
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {RULES.map((rule) => (
              <div key={rule.label}>
                <span className="font-mono text-sm font-bold text-[var(--gold)]">
                  {rule.label}
                </span>
                <h3 className="mt-1 font-semibold text-[var(--navy)]">
                  {rule.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--navy)]/70">
                  {rule.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <EntryForm
        selectedDate={selectedDate}
        onSuccess={() => {
          setSelectedDate(null);
          loadEntries();
        }}
      />

      <div>
        <h2 className="mb-3 font-serif text-xl font-bold italic text-[var(--navy)]">
          Current Guesses {loading ? "" : `(${entries.length})`}
        </h2>
        <div className="overflow-x-auto rounded-md border border-[var(--line)] bg-white shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--navy)] text-left font-mono text-xs uppercase tracking-widest text-[var(--cream)]">
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
                <tr key={e.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-2 font-medium text-[var(--navy)]">
                    {e.name}
                  </td>
                  <td className="px-4 py-2 font-mono text-[var(--navy)]/70">
                    {new Date(e.guess_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </td>
                  <td className="px-4 py-2 text-[var(--navy)]/70">{e.eye_color}</td>
                  <td className="px-4 py-2 text-[var(--navy)]/70">{e.hair_color}</td>
                  <td className="px-4 py-2 font-mono text-[var(--navy)]/70">
                    {e.weight_lbs} lbs {e.weight_oz} oz
                  </td>
                </tr>
              ))}
              {!loading && entries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-[var(--navy)]/40"
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
