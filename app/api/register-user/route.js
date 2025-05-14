// app/api/register-user/route.js
import { NextResponse } from "next/server";
import pool from "@/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  const data = await req.json();

  const { username, email, password_hash, display_name, auth_provider = "email" } = data;
  if (!email || !username) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const hashedPassword = password_hash.startsWith("$2b$")
      ? password_hash
      : await bcrypt.hash(password_hash, 10);

    const [res] = await conn.execute(
      `INSERT INTO User (username, email, password_hash)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE email=email`, // Avoid inserting duplicates
      [username, email, hashedPassword]
    );

    return NextResponse.json({ success: true, user_id: res.insertId });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
