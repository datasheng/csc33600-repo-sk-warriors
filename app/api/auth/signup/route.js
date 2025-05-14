import { NextResponse } from "next/server";
import pool from "@/db";

export async function POST(request) {
  const { auth_id, username, email } = await request.json();

  if (!auth_id || !email || !username) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `INSERT INTO User (auth_id, username, email, password_hash)
       VALUES (?, ?, ?, '')
       ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [auth_id, username, email]
    );
    return NextResponse.json({ message: "User synced", user_id: rows.insertId });
  } catch (err) {
    console.error("DB insert error:", err);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  } finally {
    conn.release();
  }
}
