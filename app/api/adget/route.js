
import pool from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Advertisement ORDER BY created_at DESC LIMIT 10`
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Failed to fetch ads:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
