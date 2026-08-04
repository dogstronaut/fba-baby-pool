import { NextRequest, NextResponse } from "next/server";
import { createEntry, getAllEntries } from "@/lib/db";
import {
  CALENDAR_MONTHS,
  EYE_COLORS,
  HAIR_COLORS,
  WEIGHT_LBS_OPTIONS,
  WEIGHT_OZ_OPTIONS,
} from "@/lib/constants";

export async function GET() {
  try {
    const entries = await getAllEntries();
    return NextResponse.json({ entries });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load entries" },
      { status: 500 }
    );
  }
}

function isDateInRange(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return CALENDAR_MONTHS.some(
    ({ year, month }) => d.getFullYear() === year && d.getMonth() === month
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      guessDate,
      eyeColor,
      hairColor,
      weightLbs,
      weightOz,
      venmoConfirmed,
    } = body;

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      typeof guessDate !== "string" ||
      !isDateInRange(guessDate) ||
      !EYE_COLORS.includes(eyeColor) ||
      !HAIR_COLORS.includes(hairColor) ||
      !WEIGHT_LBS_OPTIONS.includes(Number(weightLbs)) ||
      !WEIGHT_OZ_OPTIONS.includes(Number(weightOz)) ||
      venmoConfirmed !== true
    ) {
      return NextResponse.json(
        { error: "Invalid or incomplete submission." },
        { status: 400 }
      );
    }

    const entry = await createEntry({
      name: name.trim(),
      guessDate,
      eyeColor,
      hairColor,
      weightLbs: Number(weightLbs),
      weightOz: Number(weightOz),
      venmoConfirmed: true,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }
}
