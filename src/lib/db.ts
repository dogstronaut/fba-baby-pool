import { Pool } from "pg";

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
      guess_date DATE NOT NULL UNIQUE,
      eye_color TEXT NOT NULL,
      hair_color TEXT NOT NULL,
      weight_lbs INTEGER NOT NULL,
      weight_oz INTEGER NOT NULL,
      venmo_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
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
