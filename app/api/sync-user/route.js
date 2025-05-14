import { NextResponse } from "next/server";
import pool from "@/db";

export async function POST(request) {
  const { email, username } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [[existing]] = await conn.execute(
      "SELECT user_id FROM User WHERE email = ?",
      [email]
    );

    if (existing) {
      return NextResponse.json({ user_id: existing.user_id });
    }

    const [result] = await conn.execute(
      `INSERT INTO User (username, email, password_hash)
       VALUES (?, ?, 'oauth')`,
      [username || email, email]
    );

    return NextResponse.json({ user_id: result.insertId });
  } catch (err) {
    console.error("sync-user error:", err);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  } finally {
    conn.release();
  }
}
