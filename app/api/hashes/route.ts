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
  const hashval = searchParams.get('hashval');
  const userId = searchParams.get('user_id');
  const source = searchParams.get('source');
  const text = searchParams.get('text');

  let sql = 'SELECT * FROM hashes WHERE 1=1';
  const params: any[] = [];
  let i = 1;

  if (hashval) {
    sql += ` AND hashval = $${i++}`;
    params.push(hashval);
  }
  if (userId) {
    sql += ` AND user_id = $${i++}`;
    params.push(userId);
  }
  if (source) {
    sql += ` AND source = $${i++}`;
    params.push(source);
  }
  if (text) {
    sql += ` AND text = $${i++}`;
    params.push(text);
  }

  sql += ' ORDER BY timestamp DESC LIMIT 10';

  try {
    const res = await query(sql, params);
    return NextResponse.json({ rows: res });
  } catch (error) {
    console.error('Error fetching hashes:', error);
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}
