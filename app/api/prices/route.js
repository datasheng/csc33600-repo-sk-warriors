// app/api/prices/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { deli_id, sandwich_name, price } = await req.json();

    if (!deli_id || !sandwich_name || !price) {
      return NextResponse.json(
        { error: "Missing deli_id, sandwich_name or price" },
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

    // Get or create sandwich
    let [rows] = await pool.execute(
      "SELECT sandwich_id FROM Sandwich WHERE name = ?",
      [sandwich_name]
    );

    let sandwich_id;

    if (rows.length > 0) {
      sandwich_id = rows[0].sandwich_id;
    } else {
      const [insertResult] = await pool.execute(
        "INSERT INTO Sandwich (name) VALUES (?)",
        [sandwich_name]
      );
      sandwich_id = insertResult.insertId;
    }

    // Insert into Price_listing
    await pool.execute(
      `INSERT INTO Price_listing (deli_id, sandwich_id, price, listing_type, is_approved) 
       VALUES (?, ?, ?, 'user', false)`,
      [deli_id, sandwich_id, price]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/prices error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
