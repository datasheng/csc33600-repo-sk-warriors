import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  try {
    const { username, email, password_hash } = await request.json();

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert user into MySQL database
    const [result] = await connection.execute(
      'INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );

    // Assign default 'regular' role to new user
    const [roleResult] = await connection.execute(
      'SELECT role_id FROM Role WHERE name = "regular"'
    );
    
    if (roleResult.length > 0) {
      await connection.execute(
        'INSERT INTO User_role (user_id, role_id) VALUES (?, ?)',
        [result.insertId, roleResult[0].role_id]
      );
    }

    await connection.end();

    return NextResponse.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}