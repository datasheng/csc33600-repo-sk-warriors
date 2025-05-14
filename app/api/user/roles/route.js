import { NextResponse } from "next/server";
import pool from "@/db";

export async function GET(req) {
  try {
    const userId = Number(req.headers.get("x-user-id"));
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Missing or invalid user ID" }, { status: 400 });
    }

    const [rows] = await pool.execute(
      `SELECT r.name FROM UserRole ur
       JOIN Role r ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );

    const roles = rows.map((r) => r.name);

    return NextResponse.json({ roles: roles || [] });
  } catch (error) {
    console.error("Failed to fetch user roles:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
