// app/api/subscribe/[plan]/route.js
import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

/* Helper: simulate getting user ID from auth header */
function getCurrentUserId(req) {
  const id = req.headers.get("x-user-id");
  return id ? Number(id) : null;
}

export async function POST(request, context) {
  const { plan } = await context.params;
  const planSlug = plan.toLowerCase(); // "free", "plus", "business"

  if (!["free", "plus", "business"].includes(planSlug)) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  // ✅ Use fallback user ID for dev
  let userId = getCurrentUserId(request);
  if (!userId) {
    console.warn("⚠️ No x-user-id header sent — using fallback userId = 1");
    userId = 1; // <-- fallback user_id for local dev
  }

  // Get plan info from DB
  const [[planRow]] = await pool.execute(
    "SELECT plan_id, price, duration FROM Plan WHERE name = ? LIMIT 1",
    [planSlug.charAt(0).toUpperCase() + planSlug.slice(1)] // e.g. "Plus"
  );
  if (!planRow) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Deactivate current subscriptions
    await conn.execute(
      "UPDATE Subscription SET is_active = FALSE WHERE user_id = ? AND is_active = TRUE",
      [userId]
    );

    // Insert new subscription
    const [subRes] = await conn.execute(
      `INSERT INTO Subscription
         (user_id, plan_id, start_date, end_date, is_active)
       VALUES
         (?, ?, CURDATE(),
          DATE_ADD(CURDATE(), INTERVAL ? DAY), TRUE)`,
      [userId, planRow.plan_id, planRow.duration]
    );

    // Insert payment if needed
    if (planRow.price > 0) {
      await conn.execute(
        `INSERT INTO Payment
           (user_id, subscription_id, amount, method)
         VALUES (?, ?, ?, 'card')`,
        [userId, subRes.insertId, planRow.price]
      );
    }

    await conn.commit();

    return NextResponse.json(
      { message: `✅ Subscribed to ${planSlug}` },
      { status: 200 }
    );
  } catch (err) {
    await conn.rollback();
    console.error("❌ Subscribe error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  } finally {
    conn.release();
  }
}
