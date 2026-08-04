"use client";

import { useState } from "react";
import {
  BUY_IN_AMOUNT,
  EYE_COLORS,
  HAIR_COLORS,
  VENMO_HANDLE,
  WEIGHT_LBS_OPTIONS,
  WEIGHT_OZ_OPTIONS,
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

  const venmoLink = `https://venmo.com/${VENMO_HANDLE.replace("@", "")}?txn=pay&amount=${BUY_IN_AMOUNT}&note=${encodeURIComponent(
    "FBA Baby Pool - Camille & Scott"
  )}`;

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800">Lock In Your Guess</h3>
        <p className="text-sm text-slate-500">
          {selectedDate
            ? `Selected date: ${selectedDate}`
            : "Select an open date on the calendar to get started."}
        </p>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Step 1:</strong> Venmo{" "}
        <a
          href={venmoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          {VENMO_HANDLE}
        </a>{" "}
        ${BUY_IN_AMOUNT} to enter. <strong>You must send payment before submitting</strong> —
        entries aren&apos;t locked in until the box below is checked and payment is sent.
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Your Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First & Last"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Eye Color
          <select
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          >
            {EYE_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Hair Color
          <select
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          >
            {HAIR_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-slate-700">Birth Weight Guess</span>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Pounds
            <select
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            >
              {WEIGHT_LBS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} lbs
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Ounces
            <select
              value={weightOz}
              onChange={(e) => setWeightOz(Number(e.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
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

      <label className="flex items-start gap-2 rounded-lg border border-slate-300 p-3 text-sm text-slate-700">
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
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedDate}
        className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? "Locking in..." : "Lock In My Guess"}
      </button>
    </form>
  );
}
