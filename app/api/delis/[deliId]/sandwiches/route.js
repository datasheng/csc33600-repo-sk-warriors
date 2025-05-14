import { NextResponse } from "next/server";
import pool from "@/db";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  /* -------------------------------------------------------------
     `context.params` is a Promise in route‑handlers → await it!
  -------------------------------------------------------------- */
  const { deliId } = await context.params;          // ✅ no more warning
  const id = Number(deliId);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid deli ID" }, { status: 400 });
  }

  try {
    const [rows] = await pool.execute(
      `
      SELECT
        s.sandwich_id,
        s.name AS sandwich_name,
        pl.price,
        pl.listing_type,
        u.username  AS submitted_by,
        pl.created_at AS submitted_at
      FROM PriceListing pl
      JOIN Sandwich  s ON s.sandwich_id = pl.sandwich_id
      JOIN User      u ON u.user_id      = pl.submitted_by
      WHERE pl.deli_id     = ?
        AND pl.is_approved = TRUE
      ORDER BY s.name ASC
      `,
      [id]
    );

    return NextResponse.json({ sandwiches: rows }, { status: 200 });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
