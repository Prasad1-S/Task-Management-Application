import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, priority } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title required" },
        { status: 400 }
      );
    }
    
    const result = await query(
      "INSERT INTO tasks (user_id, title, description, priority) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.id, title, description || "", priority || "medium"]
    );

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}