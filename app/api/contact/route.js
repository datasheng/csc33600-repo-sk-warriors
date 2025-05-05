import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    // Basic validation
    if (!firstName || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Connect to the database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert the contact message
    await db.execute(
      `INSERT INTO Contact_message (first_name, last_name, email, message)
       VALUES (?, ?, ?, ?)`,
      [firstName, lastName, email, message]
    );

    await db.end();

    return NextResponse.json({ message: 'Message submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error. Message not sent. API Error', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}