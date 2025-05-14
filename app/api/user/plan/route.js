// app/api/user/plan/route.js
import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // 🔐 fallback to user_id 1 if no x-user-id header is present
    const userId = Number(req.headers.get("x-user-id")) || 1;

    const [[row]] = await pool.execute(
      `SELECT plan_name FROM user_active_plan WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    const plan = row?.plan_name?.toLowerCase() || "free";

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("GET /api/user/plan error:", err);
    return NextResponse.json(
      { error: "Failed to get user plan", plan: "free" },
      { status: 500 }
    );
  }
}
