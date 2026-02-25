import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(req, context) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {id:taskId} = await context.params;
    const { title, description, status, priority } = await req.json();

    const existingTask = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, user.id]
    );

    if (existingTask.rows.length === 0) {
      return NextResponse.json(
        { message: "Task not found or not yours" },
        { status: 404 }
      );
    }

    const updated = await query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, status, priority, taskId]
    );

    return NextResponse.json(updated.rows[0]);

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {id:taskId} = await context.params;

    const existingTask = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, user.id]
    );

    if (existingTask.rows.length === 0) {
      return NextResponse.json(
        { message: "Task not found or not yours" },
        { status: 404 }
      );
    }

    await query("DELETE FROM tasks WHERE id = $1", [taskId]);

    return NextResponse.json({ message: "Task deleted" });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}