import { Pool, types } from "pg";

// By default node-postgres parses SQL `DATE` columns (OID 1082) into JS
// Date objects, but every guess_date/actual_date column here is treated as
// a plain "YYYY-MM-DD" string throughout this app. Left unpatched, that
// auto-conversion produces "Invalid Date" once client code appends a time
// suffix (e.g. `guess_date + "T00:00:00"`) to what it assumes is a string.
types.setTypeParser(types.builtins.DATE, (value: string) => value);

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function getPool() {
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return global._pgPool;
}

export async function ensureSchema() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      guess_date DATE NOT NULL,
      eye_color TEXT NOT NULL,
      hair_color TEXT NOT NULL,
      weight_lbs INTEGER NOT NULL,
      weight_oz INTEGER NOT NULL,
      venmo_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  // Older deployments may have created guess_date as UNIQUE — multiple
  // people are now allowed to pick the same date, so drop that constraint.
  await pool.query(`
    ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_guess_date_key;
  `);
}

export type Entry = {
  id: number;
  name: string;
  guess_date: string;
  eye_color: string;
  hair_color: string;
  weight_lbs: number;
  weight_oz: number;
  venmo_confirmed: boolean;
  created_at: string;
};

export async function getAllEntries(): Promise<Entry[]> {
  await ensureSchema();
  const pool = getPool();
  const result = await pool.query<Entry>(
    "SELECT * FROM entries ORDER BY guess_date ASC"
  );
  return result.rows;
}

export async function createEntry(input: {
  name: string;
  guessDate: string;
  eyeColor: string;
  hairColor: string;
  weightLbs: number;
  weightOz: number;
  venmoConfirmed: boolean;
}): Promise<Entry> {
  await ensureSchema();
  const pool = getPool();
  const result = await pool.query<Entry>(
    `INSERT INTO entries (name, guess_date, eye_color, hair_color, weight_lbs, weight_oz, venmo_confirmed)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.name,
      input.guessDate,
      input.eyeColor,
      input.hairColor,
      input.weightLbs,
      input.weightOz,
      input.venmoConfirmed,
    ]
  );
  return result.rows[0];
}

export type Answer = {
  id: number;
  actual_date: string;
  weight_lbs: number;
  weight_oz: number;
  eye_color: string;
  hair_color: string;
  created_at: string;
};

export async function ensureAnswerSchema() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS answer (
      id INTEGER PRIMARY KEY DEFAULT 1,
      actual_date DATE NOT NULL,
      weight_lbs INTEGER NOT NULL,
      weight_oz INTEGER NOT NULL,
      eye_color TEXT NOT NULL,
      hair_color TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT answer_singleton CHECK (id = 1)
    );
  `);
}

export async function getAnswer(): Promise<Answer | null> {
  await ensureAnswerSchema();
  const pool = getPool();
  const result = await pool.query<Answer>("SELECT * FROM answer WHERE id = 1");
  return result.rows[0] ?? null;
}

export async function saveAnswer(input: {
  actualDate: string;
  weightLbs: number;
  weightOz: number;
  eyeColor: string;
  hairColor: string;
}): Promise<Answer> {
  await ensureAnswerSchema();
  const pool = getPool();
  const result = await pool.query<Answer>(
    `INSERT INTO answer (id, actual_date, weight_lbs, weight_oz, eye_color, hair_color)
     VALUES (1, $1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       actual_date = EXCLUDED.actual_date,
       weight_lbs = EXCLUDED.weight_lbs,
       weight_oz = EXCLUDED.weight_oz,
       eye_color = EXCLUDED.eye_color,
       hair_color = EXCLUDED.hair_color
     RETURNING *`,
    [
      input.actualDate,
      input.weightLbs,
      input.weightOz,
      input.eyeColor,
      input.hairColor,
    ]
  );
  return result.rows[0];
}
