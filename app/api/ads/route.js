import { NextResponse } from "next/server";
import pool from "@/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return NextResponse.json(
      { error: "Missing owner query param" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM Advertisement WHERE user_id = ? ORDER BY created_at DESC",
      [owner]
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Failed to fetch ads:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user_id = Number(req.headers.get("x-user-id"));
    if (!user_id) {
      return NextResponse.json(
        { error: "Missing or invalid user ID" },
        { status: 400 }
      );
    }

    const { title, image_url, link_url, end_date } = await req.json();

    if (!title || !image_url) {
      return NextResponse.json(
        { error: "Missing title or image_url" },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();

    await conn.execute(
      `INSERT INTO Advertisement
         (user_id, title, image_url, link_url, end_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        image_url,
        link_url || null,
        end_date || null, // ✅ use NULL if end_date is "" or undefined
      ]
    );

    conn.release();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Ad insert failed:", err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
