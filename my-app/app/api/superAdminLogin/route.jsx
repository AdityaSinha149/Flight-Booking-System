import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { password } = await request.json();

    // Retrieve the hashed password from the database
    const { rows } = await pool.query("SELECT pass FROM superadmin WHERE superadmin_id = 1");

    if (!rows.length) {
      return NextResponse.json({ success: false, error: "Super admin not found" }, { status: 404 });
    }

    const hashedPassword = rows[0].pass;

    // Compare the entered password with the hashed password
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Super Admin Login Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
