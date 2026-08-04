import { NextRequest, NextResponse } from "next/server";
import { getAllEntries, getAnswer, saveAnswer, type Entry } from "@/lib/db";
import {
  EYE_COLORS,
  HAIR_COLORS,
  WEIGHT_LBS_OPTIONS,
  WEIGHT_OZ_OPTIONS,
} from "@/lib/constants";

function isAuthorized(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  return provided === expected;
}

// Both guess_date and actual_date are DATE columns (no time component), so
// appending a fixed local time avoids UTC/local timezone day-shifting.
function daysBetween(dateA: string, dateB: string) {
  const a = new Date(dateA + "T00:00:00").getTime();
  const b = new Date(dateB + "T00:00:00").getTime();
  return Math.round(Math.abs(a - b) / 86_400_000);
}

async function buildResponse() {
  const [entries, answer] = await Promise.all([getAllEntries(), getAnswer()]);
  if (!answer) {
    return { answer: null, leaderboard: [] };
  }
  const actualWeightOz = answer.weight_lbs * 16 + answer.weight_oz;
  const leaderboard = entries
    .map((e: Entry) => {
      const eyeMatch = e.eye_color === answer.eye_color;
      const hairMatch = e.hair_color === answer.hair_color;
      return {
        ...e,
        daysOff: daysBetween(e.guess_date, answer.actual_date),
        eyeMatch,
        hairMatch,
        matchScore: (eyeMatch ? 1 : 0) + (hairMatch ? 1 : 0),
        weightDiffOz: Math.abs(
          e.weight_lbs * 16 + e.weight_oz - actualWeightOz
        ),
      };
    })
    // Ranking: closest date wins outright. Among people tied on days off
    // (most importantly, everyone who nailed the exact date), the win goes
    // to whoever matched the most attributes (eye + hair color), with
    // closest weight as the final tiebreaker, then earliest submission.
    .sort((a, b) => {
      if (a.daysOff !== b.daysOff) return a.daysOff - b.daysOff;
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
      if (a.weightDiffOz !== b.weightDiffOz)
        return a.weightDiffOz - b.weightDiffOz;
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  return { answer, leaderboard };
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await buildResponse();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load admin data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { actualDate, weightLbs, weightOz, eyeColor, hairColor } = body;

    if (
      typeof actualDate !== "string" ||
      Number.isNaN(new Date(actualDate + "T00:00:00").getTime()) ||
      !EYE_COLORS.includes(eyeColor) ||
      !HAIR_COLORS.includes(hairColor) ||
      !WEIGHT_LBS_OPTIONS.includes(Number(weightLbs)) ||
      !WEIGHT_OZ_OPTIONS.includes(Number(weightOz))
    ) {
      return NextResponse.json(
        { error: "Invalid or incomplete submission." },
        { status: 400 }
      );
    }

    await saveAnswer({
      actualDate,
      weightLbs: Number(weightLbs),
      weightOz: Number(weightOz),
      eyeColor,
      hairColor,
    });

    const data = await buildResponse();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save outcome" },
      { status: 500 }
    );
  }
}
