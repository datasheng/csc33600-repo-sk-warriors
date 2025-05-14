import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Replace with your actual DB config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("uid");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [reviews] = await connection.execute(
      `SELECT COUNT(*) AS reviewCount FROM Review WHERE user_id = ?`,
      [userId]
    );

    const [favorites] = await connection.execute(
      `SELECT COUNT(*) AS favoriteCount FROM Favorite WHERE user_id = ?`,
      [userId]
    );

    await connection.end();

    return NextResponse.json({
      reviewsMade: reviews[0].reviewCount,
      favoriteSpots: favorites[0].favoriteCount,
    });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
