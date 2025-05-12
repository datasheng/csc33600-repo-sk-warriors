import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
    });

    const [rows] = await pool.execute("SELECT * FROM Deli ORDER BY deli_id DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/delis/all error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
