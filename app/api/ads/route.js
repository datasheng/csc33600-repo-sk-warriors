// File: app/api/ads/route.js
import { NextResponse } from "next/server";
import pool from "@/db";               // ← your existing MySQL pool

/* -------------------------------------------------- */
/* tiny helper: get current user from demo header     */
async function getCurrentUser(req) {
  const id = req.headers.get("x-user-id");
  return id ? Number(id) : null;
}

/* -------------------------------------------------- */
/* check if the user’s active plan is “Business”      */
async function isBusiness(conn, userId) {
  const [[row]] = await conn.execute(
    `SELECT 1
       FROM user_active_plan
      WHERE user_id = ? AND plan_name = 'Business'
      LIMIT 1`,
    [userId]
  );
  return !!row;
}

/* ------------  POST /api/ads  (create an ad) ------------- */
export async function POST(request) {
  const userId = await getCurrentUser(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { title, image_url, link_url, end_date } = body ?? {};
  if (!title || !image_url) {
    return NextResponse.json({ error: "Missing title or image_url" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    if (!(await isBusiness(conn, userId))) {
      return NextResponse.json(
        { error: "Only Business subscribers can post ads" },
        { status: 403 }
      );
    }

    await conn.execute(
      `INSERT INTO Advertisement
         (user_id, title, image_url, link_url, end_date)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, image_url, link_url, end_date]
    );

    return NextResponse.json({ message: "Ad created" }, { status: 201 });
  } catch (err) {
    console.error("Ad create error", err);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  } finally {
    conn.release();
  }
}

/* ------------  GET /api/ads  (list active ads) ----------- */
export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [ads] = await conn.execute(
      `SELECT ad_id, title, image_url, link_url
         FROM Advertisement
        WHERE is_active = TRUE
          AND (end_date IS NULL OR end_date >= CURDATE())`
    );
    return NextResponse.json(ads);
  } finally {
    conn.release();
  }
}

export const dynamic = "force-dynamic";   // don’t cache
