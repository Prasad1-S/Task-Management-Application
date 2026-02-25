import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encrypt';


export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // pagination params
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  const [tasksResult, countResult] = await Promise.all([
    query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [user.id, limit, offset]
    ),
    query('SELECT COUNT(*) FROM tasks WHERE user_id = $1', [user.id]),
  ]);

  const total = parseInt(countResult.rows[0].count);

  return NextResponse.json({
    tasks: tasksResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    }
  });
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
  [user.id, title, encrypt(description), priority || 'medium', status || 'todo', due_date || null]
);

  return NextResponse.json(result.rows[0], { status: 201 });
}