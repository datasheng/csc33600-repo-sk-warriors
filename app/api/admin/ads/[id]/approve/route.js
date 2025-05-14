
import { NextResponse } from "next/server";
import pool from "@/db";

async function getCurrentUser(req) {
  const id = req.headers.get("x-user-id");
  return id ? Number(id) : null;
}

async function isAdmin(conn, userId) {
  const [[row]] = await conn.execute(
    `SELECT 1 FROM UserRole ur
     JOIN Role r ON ur.role_id = r.role_id
     WHERE ur.user_id = ? AND r.name = 'admin' LIMIT 1`,
    [userId]
  );
  return !!row;
}

export async function POST(request, { params }) {
  const adId = params?.id;
  const { action } = await request.json(); // action: "approve" or "disapprove"
  const userId = await getCurrentUser(request);

  const conn = await pool.getConnection();
  try {
    if (!userId || !(await isAdmin(conn, userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!["approve", "disapprove"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await conn.execute(
      `UPDATE Advertisement
          SET is_approved = ?
        WHERE ad_id = ?`,
      [action === "approve", adId]
    );

    return NextResponse.json({ success: true });
  } finally {
    conn.release();
  }
}
