export const DUE_DATE = new Date(2026, 11, 27); // Dec 27, 2026

// Calendar range shown to guessers
export const CALENDAR_MONTHS = [
  { year: 2026, month: 11 }, // December 2026 (month is 0-indexed)
  { year: 2027, month: 0 }, // January 2027
];

export const BUY_IN_AMOUNT = 10;
export const WINNER_PRIZE = 50;
export const VENMO_HANDLE = "@ashley-carroll-101";
export const CLASS_NAME = "FBA Class of 2027";

export const EYE_COLORS: string[] = [
  "Brown",
  "Blue",
  "Green",
  "Hazel",
  "Gray",
];

export const HAIR_COLORS: string[] = [
  "Bald / No hair yet",
  "Black",
  "Brown",
  "Blonde",
  "Red",
];

export const WEIGHT_LBS_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 4); // 4-12 lbs
export const WEIGHT_OZ_OPTIONS = Array.from({ length: 16 }, (_, i) => i); // 0-15 oz
