"use client";

import { useEffect, useState } from "react";
import {
  EYE_COLORS,
  HAIR_COLORS,
  WEIGHT_LBS_OPTIONS,
  WEIGHT_OZ_OPTIONS,
} from "@/lib/constants";

type LeaderboardEntry = {
  id: number;
  name: string;
  guess_date: string;
  eye_color: string;
  hair_color: string;
  weight_lbs: number;
  weight_oz: number;
  created_at: string;
  daysOff: number;
  eyeMatch: boolean;
  hairMatch: boolean;
  matchScore: number;
  weightDiffOz: number;
};

type Answer = {
  actual_date: string;
  weight_lbs: number;
  weight_oz: number;
  eye_color: string;
  hair_color: string;
};

const STORAGE_KEY = "babypool-admin-password";

export default function AdminClient() {
  const [password, setPassword] = useState(() =>
    typeof window === "undefined"
      ? ""
      : sessionStorage.getItem(STORAGE_KEY) || ""
  );
  const [authed, setAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [answer, setAnswer] = useState<Answer | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [actualDate, setActualDate] = useState("");
  const [weightLbs, setWeightLbs] = useState(WEIGHT_LBS_OPTIONS[3]);
  const [weightOz, setWeightOz] = useState(0);
  const [eyeColor, setEyeColor] = useState(EYE_COLORS[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function loadData(pw: string) {
    setAuthChecking(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-password": pw },
        cache: "no-store",
      });
      if (res.status === 401) {
        setAuthError("Incorrect password.");
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (!res.ok) throw new Error("Failed to load admin data.");
      const data = await res.json();
      setAuthed(true);
      setAnswer(data.answer);
      setLeaderboard(data.leaderboard || []);
      if (data.answer) {
        setActualDate(String(data.answer.actual_date).slice(0, 10));
        setWeightLbs(data.answer.weight_lbs);
        setWeightOz(data.answer.weight_oz);
        setEyeColor(data.answer.eye_color);
        setHairColor(data.answer.hair_color);
      }
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch {
      setAuthError("Couldn't reach the server. Please try again.");
    } finally {
      setAuthChecking(false);
    }
  }

  useEffect(() => {
    // Sync auth state with sessionStorage on initial mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (password) loadData(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    loadData(password);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          actualDate,
          weightLbs,
          weightOz,
          eyeColor,
          hairColor,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save.");
      }
      const data = await res.json();
      setAnswer(data.answer);
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-16">
        <h1 className="font-serif text-2xl font-bold italic text-[var(--navy)]">
          Admin Access
        </h1>
        <form
          onSubmit={handleUnlock}
          className="ledger-card flex flex-col gap-3 p-6"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)] focus:border-[var(--stamp)] focus:outline-none"
            />
          </label>
          {authError && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
              {authError}
            </p>
          )}
          <button
            type="submit"
            disabled={authChecking}
            className="btn-ledger rounded px-4 py-2.5 disabled:cursor-not-allowed disabled:bg-[var(--navy)]/30"
          >
            {authChecking ? "Checking..." : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="font-serif text-2xl font-bold italic text-[var(--navy)]">
        Admin — Record the Outcome
      </h1>

      <form
        onSubmit={handleSave}
        className="ledger-card flex flex-col gap-4 p-6"
      >
        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
          Actual Birth Date
          <input
            type="date"
            required
            value={actualDate}
            onChange={(e) => setActualDate(e.target.value)}
            className="rounded border border-[var(--navy)]/25 px-3 py-2 text-[var(--navy)] focus:border-[var(--stamp)] focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
            Weight (lbs)
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
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--navy)]">
            Weight (oz)
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

        {saveError && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {saveError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-ledger rounded px-4 py-2.5 disabled:cursor-not-allowed disabled:bg-[var(--navy)]/30"
        >
          {saving ? "Saving..." : answer ? "Update Outcome" : "Save Outcome"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 font-serif text-xl font-bold italic text-[var(--navy)]">
          Leaderboard
        </h2>
        {!answer && (
          <p className="text-sm text-[var(--navy)]/60">
            Enter the outcome above to compute the leaderboard.
          </p>
        )}
        {answer && (
          <>
            <p className="mb-3 text-sm text-[var(--navy)]/60">
              Ranked by closest date first; ties broken by most attributes
              matched (eyes + hair), then closest weight, then earliest
              submission.
            </p>
            <div className="overflow-x-auto rounded-md border border-[var(--line)] bg-white shadow-md">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--navy)] text-left font-mono text-xs uppercase tracking-widest text-[var(--cream)]">
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Guess</th>
                    <th className="px-4 py-2">Days Off</th>
                    <th className="px-4 py-2">Eyes</th>
                    <th className="px-4 py-2">Hair</th>
                    <th className="px-4 py-2">Weight Off</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((e, i) => (
                    <tr
                      key={e.id}
                      className={`border-t border-[var(--line)] ${
                        i === 0 ? "bg-[var(--vault-soft)]" : ""
                      }`}
                    >
                      <td className="px-4 py-2 font-mono font-bold text-[var(--navy)]">
                        {i === 0 ? "🏆 Winner" : i + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-[var(--navy)]">
                        {e.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-[var(--navy)]/70">
                        {new Date(
                          e.guess_date + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2 font-mono text-[var(--navy)]/70">
                        {e.daysOff}
                      </td>
                      <td className="px-4 py-2 text-[var(--navy)]/70">
                        {e.eyeMatch ? "✅" : "—"} {e.eye_color}
                      </td>
                      <td className="px-4 py-2 text-[var(--navy)]/70">
                        {e.hairMatch ? "✅" : "—"} {e.hair_color}
                      </td>
                      <td className="px-4 py-2 font-mono text-[var(--navy)]/70">
                        {e.weightDiffOz} oz
                      </td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-[var(--navy)]/40"
                      >
                        No entries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
