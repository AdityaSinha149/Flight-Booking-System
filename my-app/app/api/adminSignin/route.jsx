import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    connection = await db.getConnection();
    const { username, password } = await request.json();
    
    const isEmail = username.includes('@');
    const field = isEmail ? 'email' : 'phone_no';
    
    const [rows] = await connection.execute(`
      SELECT *, CONCAT(first_name, ' ', last_name) AS admin_name 
      FROM admin 
      WHERE ${field} = ?
      LIMIT 1
    `, [username]);
    
    if (!rows.length) {
      connection.release();
      return NextResponse.json({ 
        error: `Admin not found with this ${isEmail ? 'email' : 'phone number'}` 
      }, { status: 401 });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.pass || "");
    if (!match) {
      connection.release();
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    connection.release();
    return NextResponse.json({
      adminId: admin.admin_id,
      adminName: admin.admin_name,
      airline: admin.airline_name
    });
  } catch (err) {
    if (connection) connection.release();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
