import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

/* Helper – grab numeric user_id from the request header */
function getCurrentUserId(req) {
  const headerVal = req.headers.get("x-user-id");
  const id = Number(headerVal);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request) {
  const userId = getCurrentUserId(request);

  /* 1️⃣  Guard: must be signed‑in */
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const conn = await pool.getConnection();
  try {
    /* 2️⃣  Base user record + (optional) active plan */
    const [[userRow]] = await conn.execute(
      `SELECT u.user_id,
              u.username,
              u.email,
              u.join_date,
              p.plan_name,
              p.price,
              p.end_date
         FROM User u
    LEFT JOIN user_active_plan p ON u.user_id = p.user_id
        WHERE u.user_id = ?`,
      [userId]
    );

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 3️⃣  Wallet balance + stats */
    const [[wallet]]  = await conn.execute(
      "SELECT balance FROM Wallet WHERE user_id = ?",
      [userId]
    );

    const [
      [{ favs }],
      [{ revs }],
      [{ ads }],
    ] = await Promise.all([
      conn.execute("SELECT COUNT(*) AS favs FROM Favorite       WHERE user_id = ?", [userId]),
      conn.execute("SELECT COUNT(*) AS revs FROM Review         WHERE user_id = ?", [userId]),
      conn.execute("SELECT COUNT(*) AS ads  FROM Advertisement  WHERE user_id = ?", [userId]),
    ]).then((r) => r.map(([row]) => row));

    /* 4️⃣  Build response */
    return NextResponse.json({
      user: {
        id:        userRow.user_id,
        username:  userRow.username,
        email:     userRow.email,
        joined:    userRow.join_date,
      },
      plan: userRow.plan_name
        ? {
            name:  userRow.plan_name,
            price: Number(userRow.price),
            ends:  userRow.end_date,
          }
        : null,
      wallet: { balance: Number(wallet?.balance ?? 0) },
      stats:  { favorites: favs, reviews: revs, ads },
    });
  } catch (err) {
    console.error("[profile] DB error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    conn.release();
  }
}
