// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const { text, prediction, timestamp, source, userId } = body;

  try {
    await query(
      'INSERT INTO logs (text, prediction, timestamp, source, user_id) VALUES ($1, $2, $3, $4, $5)',
      [text, prediction, timestamp, source, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting log:', error);
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';

  let sql = 'SELECT * FROM logs';
  const params: string[] = [];

  if (filter !== 'all') {
    sql += ' WHERE prediction = $1';
    params.push(filter);
  }

  sql += ' ORDER BY timestamp DESC LIMIT 100';

  const res = await query(sql, params);

  return NextResponse.json({ rows: res });
}

