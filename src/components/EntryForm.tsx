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
      id="entry-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border-2 border-[#12233f]/15 bg-[#fffdf7] p-5 shadow-md sm:p-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#c99b3d]">
          Ledger Entry
        </p>
        <h3 className="font-serif text-xl font-bold text-[#12233f]">
          Lock In Your Guess
        </h3>
        <p className="text-sm text-[#12233f]/60">
          {selectedDate
            ? `Selected date: ${selectedDate} — multiple people may guess the same date.`
            : "Select a date on the calendar above to get started."}
        </p>
      </div>

      <div className="rounded-xl border-2 border-[#c99b3d] bg-[#f7ecc9] p-3 text-sm text-[#3a2e0f]">
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

      <label className="flex flex-col gap-1 text-sm font-medium text-[#12233f]">
        Your Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First & Last"
          className="rounded-lg border border-[#12233f]/25 px-3 py-2 text-[#12233f] focus:border-[#c99b3d] focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-[#12233f]">
          Eye Color
          <select
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            className="rounded-lg border border-[#12233f]/25 px-3 py-2 text-[#12233f]"
          >
            {EYE_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-[#12233f]">
          Hair Color
          <select
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            className="rounded-lg border border-[#12233f]/25 px-3 py-2 text-[#12233f]"
          >
            {HAIR_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-[#12233f]">Birth Weight Guess</span>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-[#12233f]/70">
            Pounds
            <select
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="rounded-lg border border-[#12233f]/25 px-3 py-2 text-[#12233f]"
            >
              {WEIGHT_LBS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} lbs
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#12233f]/70">
            Ounces
            <select
              value={weightOz}
              onChange={(e) => setWeightOz(Number(e.target.value))}
              className="rounded-lg border border-[#12233f]/25 px-3 py-2 text-[#12233f]"
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

      <label className="flex items-start gap-2 rounded-lg border border-[#12233f]/25 p-3 text-sm text-[#12233f]">
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
        className="rounded-lg bg-[#12233f] px-4 py-2.5 font-semibold text-[#f2ead6] transition hover:bg-[#1c3358] disabled:cursor-not-allowed disabled:bg-[#12233f]/30"
      >
        {submitting ? "Locking in..." : "Lock In My Guess"}
      </button>
    </form>
  );
}
