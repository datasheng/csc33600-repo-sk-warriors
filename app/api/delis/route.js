import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS, // support either
  database: process.env.DB_NAME || "smart_finder",
};

export async function POST(req) {
  try {
    const { name, address, phone } = await req.json();
    if (!name || !address)
      return NextResponse.json({ error: "missing fields" }, { status: 400 });

    const pool = await mysql.createPool(DB_CONFIG);
    const [res] = await pool.execute(
      "INSERT INTO Deli (name, address, phone, place_id) VALUES (?, ?, ?, NULL)",
      [name, address, phone || null]
    );

    return NextResponse.json(
      {
        deli_id: res.insertId,
        name,
        address,
        phone,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API /api/delis error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
