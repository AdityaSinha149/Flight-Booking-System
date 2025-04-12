import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    connection = await db.getConnection();

    const { username, password } = await request.json();
    
    // Determine if username is email or phone number
    const isEmail = username.includes('@');
    
    // Build the query based on username type
    let query, params;
    if (isEmail) {
      query = `
        SELECT a.*, CONCAT(a.first_name, ' ', a.last_name) AS admin_name 
        FROM admin a 
        WHERE email = ?
        LIMIT 1
      `;
      params = [username];
    } else {
      query = `
        SELECT a.*, CONCAT(a.first_name, ' ', a.last_name) AS admin_name 
        FROM admin a 
        WHERE phone_no = ?
        LIMIT 1
      `;
      params = [username];
    }

    // Execute the optimized query
    const [rows] = await connection.execute(query, params);
    
    if (!rows || rows.length === 0) {
      connection.release();
      return NextResponse.json({ 
        error: `Admin not found with ${isEmail ? 'email' : 'phone number'}.` 
      }, { status: 401 });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.pass || "");
    if (!match) {
      connection.release();
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    // If valid, return success with admin details
    connection.release();
    return NextResponse.json({
      adminId: admin.admin_id,
      adminName: admin.admin_name,
      airline: admin.airline_name
    });
  } catch (err) {
    console.error("Admin signin error:", err);
    if (connection) connection.release();
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
