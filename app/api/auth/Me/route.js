import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db'; // your pg connection

export async function GET() {
  const token = cookies().get('token')?.value;
  if (!token) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
    if (!result.rows[0]) return Response.json({ message: 'User not found' }, { status: 404 });
    return Response.json({ user: result.rows[0] });
  } catch {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }
}