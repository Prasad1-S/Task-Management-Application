// app/api/tasks/[id]/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PUT(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { title, description, priority, status, due_date } = await req.json();

  const result = await query(
    `UPDATE tasks SET title=$1, description=$2, priority=$3, status=$4, due_date=$5
     WHERE id=$6 AND user_id=$7 RETURNING *`,
    [title, description, priority, status, due_date || null, params.id, user.id]
  );
  if (!result.rows[0]) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [params.id, user.id]);
  return NextResponse.json({ message: 'Deleted' });
}