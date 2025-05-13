
import { NextResponse } from "next/server";
import pool from "@/db";

async function getCurrentUser(req) {
  const id = req.headers.get("x-user-id");   
  return id ? Number(id) : null;
}

export const dynamic = "force-dynamic";

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

   
    await conn.execute(
      `INSERT INTO Wallet (user_id, balance)
             VALUES (?, ?)
       ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance)`,
      [userId, value]
    );

  
    await conn.execute(
      `INSERT INTO WalletTransaction
         (user_id, amount, tx_type, description)
       VALUES (?, ?, 'deposit', 'Play‑cash top‑up')`,
      [userId, value]
    );

    
    const [[row]] = await conn.execute(
      "SELECT balance FROM Wallet WHERE user_id = ?",
      [userId]
    );
    const newBalance = Number(row.balance);

    await conn.commit();
    return NextResponse.json({ balance: newBalance }, { status: 200 });
  } catch (err) {
    await conn.rollback();
    console.error("Deposit error:", err);
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 });
  } finally {
    conn.release();
  }
}
