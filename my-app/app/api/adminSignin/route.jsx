import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { pool } from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    const { username, password } = await request.json();
    
    const isEmail = username.includes('@');
    const field = isEmail ? 'email' : 'phone_no';
    
    const { rows } = await pool.query(
      `SELECT *,
              CONCAT(first_name,' ',last_name) AS admin_name
       FROM admin
       WHERE ${field} = $1
       LIMIT 1`,
      [username]
    );
    
    if (!rows.length) {
      return NextResponse.json({ 
        error: `Admin not found with this ${isEmail ? 'email' : 'phone number'}` 
      }, { status: 401 });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.pass || "");
    if (!match) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    return NextResponse.json({
      adminId: admin.admin_id,
      adminName: admin.admin_name,
      airline: admin.airline_name
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
