export const runtime = "nodejs";
import { NextResponse } from "next/server";
import pool from "@/db";

export async function POST(request) {
  let conn;
  try {
    const { username, email, password_hash, auth_provider, display_name } =
      await request.json();
    console.log("[SERVER] POST /api/register-user", { email, auth_provider });

    conn = await pool.getConnection();
    //check for existing user
    const [[exists]] = await conn.query(
      "SELECT user_id FROM `User` WHERE email = ?",
      [email]
    );
    if (exists)
      return NextResponse.json({
        success: true,
        message: "Already registered",
      });

    await conn.beginTransaction();

    //insert user
    const [result] = await conn.query(
      `INSERT INTO \`User\`
        (username, email, password_hash, auth_provider, display_name, last_active)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        username || email,
        email,
        auth_provider === "email" ? password_hash : null,
        auth_provider,
        display_name || username || email.split("@")[0],
      ]
    );
    console.log("[SERVER] INSERT ID:", result.insertId);

    await conn.query(
      `INSERT INTO User_role
         (user_id, role_id)
       VALUES (?, (SELECT role_id FROM Role WHERE name = 'regular'))`,
      [result.insertId]
    );

    await conn.commit();
    console.log("[SERVER] Registration successful for:", email);

    return NextResponse.json({ success: true, userId: result.insertId });
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    console.error("[SERVER] Registration error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
