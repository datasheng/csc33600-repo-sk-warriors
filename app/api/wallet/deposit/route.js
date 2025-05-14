// File: app/api/wallet/route.js  (you can keep the same filename/location)
/* eslint @next/next/no-server-import-in-page: "off" */

import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
async function getCurrentUser(req) {
  // 👈  adjust this if you later move user‑ID into a cookie / JWT / etc.
  const id = req.headers.get("x-user-id");
  return id ? Number(id) : null;
}

/* ------------------------------------------------------------------ */
/* GET  /api/wallet           →  { balance: number }                  */
/* ------------------------------------------------------------------ */
export async function GET(request) {
  const userId = await getCurrentUser(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const [rows] = await pool.execute(
    "SELECT balance FROM Wallet WHERE user_id = ?",
    [userId],
  );

  // default to 0 if the user hasn’t deposited yet
  const balance = rows.length ? Number(rows[0].balance) : 0;

  return NextResponse.json({ balance }, { status: 200 });
}

/* ------------------------------------------------------------------ */
/* POST /api/wallet  (deposit)  →  { balance: number }                */
/* ------------------------------------------------------------------ */
export async function POST(request) {
  const userId = await getCurrentUser(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { amount } = await request.json();
  const value = Number(amount);

  if (!value || value <= 0) {
    return NextResponse.json({ error: "Deposit must be > 0" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // upsert + increment
    await conn.execute(
      `INSERT INTO Wallet (user_id, balance)
             VALUES (?, ?)
       ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance)`,
      [userId, value],
    );

    // audit trail
    await conn.execute(
      `INSERT INTO WalletTransaction
         (user_id, amount, tx_type, description)
       VALUES (?, ?, 'deposit', 'Play‑cash top‑up')`,
      [userId, value],
    );

    // fetch the updated balance
    const [[row]] = await conn.execute(
      "SELECT balance FROM Wallet WHERE user_id = ?",
      [userId],
    );

    await conn.commit();
    return NextResponse.json(
      { balance: Number(row.balance) },
      { status: 200 },
    );
  } catch (err) {
    await conn.rollback();
    console.error("Deposit error:", err);
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 });
  } finally {
    conn.release();
  }
}
