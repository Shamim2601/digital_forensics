// app/api/hashes/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const { text, hashval, source, userId } = body;

  try {
    await query(
      'INSERT INTO hashes (text, hashval, source, user_id) VALUES ($1, $2, $3, $4)',
      [text, hashval, source, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting hash:', error);
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hashval = searchParams.get('hashval'); // ← new query param

  let sql = 'SELECT * FROM hashes';
  const params: string[] = [];

  if (hashval) {
    sql += ' WHERE hashval = $1';
    params.push(hashval);
  }

  sql += ' ORDER BY timestamp DESC LIMIT 1';

  try {
    const res = await query(sql, params);
    return NextResponse.json({ rows: res });
  } catch (error) {
    console.error('Error fetching hashes:', error);
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}

