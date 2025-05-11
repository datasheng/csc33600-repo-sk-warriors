// app/api/register-user/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import pool from '@/db';

export async function POST(request) {
  let connection;
  try {
    // Parse request body
    const { username, email, password_hash, auth_provider = 'email', display_name } = await request.json();
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Log what we're trying to save
    console.log('[SERVER] Attempting to register user:', {
      username: username || email,
      email,
      auth_provider,
      display_name: display_name || username || email.split('@')[0]
    });
    
    // Get database connection
    connection = await pool.getConnection();
    
    // Check if user already exists (prevents duplicate errors)
    const [existingUsers] = await connection.query(
      'SELECT user_id FROM User WHERE email = ?', 
      [email]
    );
    
    if (existingUsers.length > 0) {
      // User already exists, just return success
      console.log('User already exists in database, skipping insertion:', email);
      return NextResponse.json({ success: true, message: "User already registered" });
    }
    
    // Begin transaction
    await connection.beginTransaction();

    // Insert user into database
    const [result] = await connection.query(
      `INSERT INTO User (
        username, 
        email, 
        password_hash, 
        auth_provider, 
        display_name,
        last_active
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        username || email, // Fallback to email if username not provided
        email,
        auth_provider === 'email' ? password_hash : null,
        auth_provider,
        display_name || username || email.split('@')[0] // Fallback chain
      ]
    );

    // Get the inserted user ID
    const userId = result.insertId;
    
    // Assign default 'regular' role
    await connection.query(
      'INSERT INTO User_role (user_id, role_id) VALUES (?, (SELECT role_id FROM Role WHERE name = "regular"))',
      [userId]
    );
    
    // Commit transaction
    await connection.commit();
    
    console.log('Successfully registered user in MySQL:', email, 'with ID:', userId);
    return NextResponse.json({ 
      success: true,
      userId: userId
    });

  } catch (error) {
    // Rollback on error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }
    
    console.error('Database registration error:', error);
    
    // Return a helpful error message
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to register user: " + error.message,
        code: error.code // Including MySQL error code can help debugging
      },
      { status: 500 }
    );
  } finally {
    // Always release the connection
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error('Error releasing connection:', releaseError);
      }
    }
  }
}