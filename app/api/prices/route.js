// app/api/prices/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { deli_id, sandwich_name, price } = await req.json();

    if (!deli_id || !sandwich_name || !price) {
      return NextResponse.json(
        { error: "Missing deli_id, sandwich_name, or price" },
        { status: 400 }
      );
    }

    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
    });

    // TODO: replace with the real logged‑in user
    const submitted_by = 1;

    /* ---------------------------------------------------
       1. Get (or create) the sandwich
    ---------------------------------------------------- */
    const [rows] = await pool.execute(
      "SELECT sandwich_id FROM Sandwich WHERE name = ? LIMIT 1",
      [sandwich_name.trim()]
    );

    let sandwich_id;
    if (rows.length > 0) {
      sandwich_id = rows[0].sandwich_id;
    } else {
      const [insertResult] = await pool.execute(
        "INSERT INTO Sandwich (name) VALUES (?)",
        [sandwich_name.trim()]
      );
      sandwich_id = insertResult.insertId;
    }

    /* ---------------------------------------------------
       2. Insert approved price listing ✔️
    ---------------------------------------------------- */
    await pool.execute(
      `INSERT INTO PriceListing
         (deli_id, sandwich_id, submitted_by, price, listing_type, is_approved)
       VALUES (?, ?, ?, ?, 'user', TRUE)`,   // <-- auto‑approved now
      [deli_id, sandwich_id, submitted_by, parseFloat(price)]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/prices error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
