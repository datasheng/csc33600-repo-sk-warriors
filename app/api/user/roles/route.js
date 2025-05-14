import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const rawUserId = req.headers.get("x-user-id");

    if (!rawUserId) {
      return NextResponse.json({ error: "Missing user ID header" }, { status: 400 });
    }

    const userId = Number(rawUserId);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const [rows] = await pool.execute(
      `SELECT r.name FROM UserRole ur
       JOIN Role r ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );

    const roles = rows.map((r) => r.name);

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Failed to fetch user roles:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
