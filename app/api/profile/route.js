import { NextResponse } from "next/server";
import pool from "@/db";

// Updated: UUID-safe extraction
async function getCurrentUser(req) {
  const id = req.headers.get("x-user-id");
  console.log("[profile] x-user-id header:", id);
  return id || null; // Use UUID string as-is
}

export const dynamic = "force-dynamic";

export async function GET(request) {
  const externalId = await getCurrentUser(request);
  if (!externalId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const conn = await pool.getConnection();
  try {
    // Updated: query by external_id instead of user_id
    const [[userRow]] = await conn.execute(
      `SELECT u.user_id, u.username, u.email, u.join_date,
              p.plan_name, p.price, p.end_date
         FROM User u
    LEFT JOIN user_active_plan p ON u.user_id = p.user_id
        WHERE u.external_id = ?`,
      [externalId]
    );

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [[walletRow]] = await conn.execute(
      "SELECT balance FROM Wallet WHERE user_id = ?",
      [userRow.user_id]
    );
    const balance = Number(walletRow?.balance ?? 0);

    const [
      [{ favs }],
      [{ revs }],
      [{ ads }],
    ] = await Promise.all([
      conn.execute("SELECT COUNT(*) AS favs FROM Favorite WHERE user_id = ?", [userRow.user_id]),
      conn.execute("SELECT COUNT(*) AS revs FROM Review   WHERE user_id = ?", [userRow.user_id]),
      conn.execute("SELECT COUNT(*) AS ads  FROM Advertisement WHERE user_id = ?", [userRow.user_id]),
    ]).then((res) => res.map(([r]) => r));

    return NextResponse.json({
      user: {
        id: userRow.user_id,
        username: userRow.username,
        email: userRow.email,
        joined: userRow.join_date,
      },
      plan: userRow.plan_name
        ? {
            name: userRow.plan_name,
            price: Number(userRow.price),
            ends: userRow.end_date,
          }
        : null,
      wallet: { balance },
      stats: {
        favorites: favs,
        reviews: revs,
        ads,
      },
    });
  } catch (err) {
    console.error("Profile route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    conn.release();
  }
}
