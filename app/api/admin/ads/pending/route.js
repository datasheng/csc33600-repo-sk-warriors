
import { NextResponse } from "next/server";
import pool from "@/db";

async function getCurrentUser(req) {
  const id = req.headers.get("x-user-id");
  return id ? Number(id) : null;
}

async function isAdmin(conn, userId) {
  const [[row]] = await conn.execute(
    `SELECT 1 FROM UserRole ur
     JOIN Role r ON ur.role_id = r.role_id
     WHERE ur.user_id = ? AND r.name = 'admin' LIMIT 1`,
    [userId]
  );
  return !!row;
}

export async function GET(request) {
  const userId = await getCurrentUser(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conn = await pool.getConnection();
  try {
    if (!(await isAdmin(conn, userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [rows] = await conn.execute(
      `SELECT ad_id, title, image_url, is_approved, user_id
         FROM Advertisement
        WHERE is_approved = FALSE
        ORDER BY created_at DESC`
    );

    return NextResponse.json(rows);
  } finally {
    conn.release();
  }
}
