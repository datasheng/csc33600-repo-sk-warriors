import { stackServerApp } from "@/stack";
import pool from "@/db";
import { NextResponse } from "next/server";

// GET: Return all favorites for current user
export async function GET(req) {
  const user = await stackServerApp.getUser({ req }); // ✅ Cookie-based auth

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT deli_id FROM Favorite WHERE user_id = ?`,
      [user.id]
    );

    return NextResponse.json({ favorites: rows });
  } catch (err) {
    console.error("🔥 GET /api/favorites error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Add a favorite
export async function POST(req) {
  const user = await stackServerApp.getUser({ req });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { store_name, street_address } = await req.json();

  if (!store_name || !street_address) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const [existing] = await pool.execute(
      `SELECT deli_id FROM Deli WHERE store_name = ? AND street_address = ?`,
      [store_name, street_address]
    );

    let deli_id;
    if (existing.length > 0) {
      deli_id = existing[0].deli_id;
    } else {
      const [insert] = await pool.execute(
        `INSERT INTO Deli (store_name, street_address) VALUES (?, ?)`,
        [store_name, street_address]
      );
      deli_id = insert.insertId;
    }

    await pool.execute(
      `INSERT IGNORE INTO Favorite (user_id, deli_id) VALUES (?, ?)`,
      [user.id, deli_id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 POST /api/favorites error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a favorite
export async function DELETE(req) {
  const user = await stackServerApp.getUser({ req });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { store_name, street_address } = await req.json();

  if (!store_name || !street_address) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    const [existing] = await pool.execute(
      `SELECT deli_id FROM Deli WHERE store_name = ? AND street_address = ?`,
      [store_name, street_address]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Deli not found" }, { status: 404 });
    }

    const deli_id = existing[0].deli_id;

    await pool.execute(
      `DELETE FROM Favorite WHERE user_id = ? AND deli_id = ?`,
      [user.id, deli_id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
