"use client";

import { useState } from "react";
import {
  BUY_IN_AMOUNT,
  EYE_COLORS,
  HAIR_COLORS,
  VENMO_HANDLE,
  WEIGHT_LBS_OPTIONS,
  WEIGHT_OZ_OPTIONS,
  buildVenmoPayLink,
} from "@/lib/constants";

export default function EntryForm({
  selectedDate,
  onSuccess,
}: {
  selectedDate: string | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [eyeColor, setEyeColor] = useState(EYE_COLORS[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [weightLbs, setWeightLbs] = useState(WEIGHT_LBS_OPTIONS[3]);
  const [weightOz, setWeightOz] = useState(0);
  const [venmoConfirmed, setVenmoConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const venmoLink = buildVenmoPayLink("Baby Pool");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) {
      setError("Pick a date on the calendar first.");
      return;
    }
    if (!venmoConfirmed) {
      setError(
        `You must Venmo ${VENMO_HANDLE} the $${BUY_IN_AMOUNT} buy-in and check the box below before you can lock in your guess.`
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          guessDate: selectedDate,
          eyeColor,
          hairColor,
          weightLbs,
          weightOz,
          venmoConfirmed,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      onSuccess();
      setName("");
      setVenmoConfirmed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <span className="exhibit-tab">Exhibit D</span>
      <form
        id="entry-form"
        onSubmit={handleSubmit}
        className="ledger-card flex flex-col gap-4 p-5 pl-8 sm:p-6 sm:pl-10"
      >
      <div>
        <p className="mono-eyebrow">Ledger Entry</p>
        <h3 className="font-serif text-xl font-bold italic text-[var(--navy)]">
          Lock In Your Guess
        </h3>
        <p className="text-sm text-[var(--navy)]/60">
          {selectedDate
            ? `Selected date: ${selectedDate} — multiple people may guess the same date.`
            : "Select a date on the calendar above to get started."}
        </p>
      </div>

      <div className="rounded border-2 border-[var(--gold)] bg-[var(--cream-deep)] p-3 text-sm text-[var(--navy)]">
        <strong>Step 1:</strong> Venmo{" "}
        <a href={venmoLink} className="font-bold underline">
          {VENMO_HANDLE}
        </a>{" "}
        ${BUY_IN_AMOUNT} to enter (note: &ldquo;Baby Pool&rdquo;).{" "}
        <strong>You must send payment before submitting</strong> —
        entries aren&apos;t locked in until the box below is checked and payment is sent.
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
        Your Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First & Last"
          className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)] focus:border-[var(--stamp)] focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
          Eye Color
          <select
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)]"
          >
            {EYE_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
          Hair Color
          <select
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)]"
          >
            {HAIR_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-[var(--navy)]">
          Birth Weight Guess
        </span>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-[var(--navy)]/70">
            Pounds
            <select
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)]"
            >
              {WEIGHT_LBS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} lbs
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--navy)]/70">
            Ounces
            <select
              value={weightOz}
              onChange={(e) => setWeightOz(Number(e.target.value))}
              className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)]"
            >
              {WEIGHT_OZ_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} oz
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <label className="flex items-start gap-2 rounded border border-[var(--navy)]/25 p-3 text-sm text-[var(--navy)]">
        <input
          type="checkbox"
          required
          checked={venmoConfirmed}
          onChange={(e) => setVenmoConfirmed(e.target.checked)}
          className="mt-1"
        />
        <span>
          I confirm I&apos;ve sent <strong>${BUY_IN_AMOUNT}</strong> via Venmo to{" "}
          <strong>{VENMO_HANDLE}</strong>. I understand my guess won&apos;t be
          locked in until this is checked and submitted.
        </span>
      </label>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedDate}
        className="btn-ledger rounded px-4 py-2.5 disabled:cursor-not-allowed disabled:bg-[var(--navy)]/30"
      >
        {submitting ? "Locking in..." : "Lock In My Guess"}
      </button>
      </form>
    </div>
  );
}
