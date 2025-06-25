// lib/db.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:nDtJkvWNL7l3@ep-still-hill-a19mjgcj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false, // Needed for Neon
  },
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}
