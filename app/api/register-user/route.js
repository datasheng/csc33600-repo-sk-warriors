export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import pool from '@/db';

const ADMIN_EMAILS = ['hamimc232@gmail.com']; // Add more admin emails as needed

export async function POST(request) {
  let connection;
  try {
    const { username, email, password_hash, auth_provider = 'email', display_name } = await request.json();
    
    // 1. Get a fresh connection
    connection = await pool.getConnection();
    
    // 2. Start transaction EXPLICITLY
    await connection.beginTransaction();

    // 3. Insert user (with error logging)
    const [result] = await connection.query(
      `INSERT INTO User (
        username, 
        email, 
        password_hash, 
        auth_provider, 
        display_name
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        username,
        email,
        auth_provider === 'email' ? password_hash : null,
        auth_provider,
        display_name || username
      ]
    );

    // 4. COMMIT explicitly
    await connection.commit();
    
    console.log('Successfully inserted user:', email);
    return NextResponse.json({ success: true });

  } catch (error) {
    // 5. ROLLBACK on error
    if (connection) await connection.rollback();
    console.error('DATABASE ERROR:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    // 6. ALWAYS release connection
    if (connection) connection.release();
  }
}