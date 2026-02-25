import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const result = await query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [user.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { title, description, priority, status, due_date } = await req.json();
  if (!title) return NextResponse.json({ message: 'Title required' }, { status: 400 });

  const result = await query(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.id, title, description, priority || 'medium', status || 'todo', due_date || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}