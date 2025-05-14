import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req) {
  try {
    const { userId, deliId, rating, comment } = await req.json();

    if (!userId || !deliId || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO Review (user_id, deli_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [userId, deliId, rating, comment || null]
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting review:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
