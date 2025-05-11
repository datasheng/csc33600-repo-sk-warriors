// app/api/waitlist/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await db.execute('INSERT INTO waitlist (email) VALUES (?)', [email]);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (err) {
    console.error('DB Error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
