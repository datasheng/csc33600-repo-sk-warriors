// app/api/subscribe/[plan]/route.js
import { NextResponse } from "next/server";
import pool from "@/db";

async function getCurrentUser(request) {
  const header = request.headers.get("x-user-id");
  return header ? Number(header) : null;
}

export async function POST(request, { params }) {
  // 1. await the params object
  const { plan } = await params;
  const planName = (plan ?? "").trim().toLowerCase();
  if (!planName) {
    return NextResponse.json({ error: "Plan missing in URL" }, { status: 400 });
  }

  // 2. very light auth
  const user_id = await getCurrentUser(request);
  if (!user_id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 3. fetch the plan
    const [[planRow]] = await conn.execute(
      "SELECT plan_id, name, price, duration FROM Plan WHERE LOWER(name)=? LIMIT 1",
      [planName]
    );
    if (!planRow) {
      await conn.rollback();
      return NextResponse.json(
        { error: `Plan '${planName}' does not exist` },
        { status: 404 }
      );
    }

    // 4. prevent duplicate active sub for this plan
    const [[dupe]] = await conn.execute(
      "SELECT 1 FROM Subscription WHERE user_id=? AND plan_id=? AND is_active=TRUE LIMIT 1",
      [user_id, planRow.plan_id]
    );
    if (dupe) {
      await conn.rollback();
      return NextResponse.json(
        { error: "User already has an active subscription for this plan" },
        { status: 400 }
      );
    }

    // 5. create the new subscription
    const [subRes] = await conn.execute(
      `INSERT INTO Subscription
           (user_id, plan_id, start_date, end_date, is_active)
         VALUES
           (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY), TRUE)`,
      [user_id, planRow.plan_id, planRow.duration]
    );
    const subscription_id = subRes.insertId;

    // 6. sync role (if it exists)
    const [[role]] = await conn.execute(
      "SELECT role_id FROM Role WHERE LOWER(name)=? LIMIT 1",
      [planRow.name.toLowerCase()]
    );
    if (role) {
      await conn.execute(
        "INSERT IGNORE INTO UserRole (user_id, role_id) VALUES (?, ?)",
        [user_id, role.role_id]
      );
    }

    // 7. record payment if plan is paid
    if (+planRow.price > 0) {
      await conn.execute(
        `INSERT INTO Payment (user_id, subscription_id, amount, method)
             VALUES (?, ?, ?, ?)`,
        [user_id, subscription_id, planRow.price, "card"]
      );
    }

    await conn.commit();
    return NextResponse.json(
      { message: `Subscribed to ${planRow.name}`, subscription_id },
      { status: 200 }
    );
  } catch (err) {
    await conn.rollback();
    console.error("Subscribe route error:", err);
    return NextResponse.json(
      { error: "Subscription failed", detail: err.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

export const dynamic = "force-dynamic";
