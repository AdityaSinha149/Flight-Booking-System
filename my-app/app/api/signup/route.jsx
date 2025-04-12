import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req) {
  let connection;
  try {
    const { firstName, lastName, email, phone_no, password } = await req.json();

    if (!firstName || !lastName || !email || !phone_no || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    connection = await db.getConnection();

    // Check if email or phone number already exists
    const [existingUser] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ? OR phone_no = ?", 
      [email, phone_no]
    );

    if (existingUser.length) {
      connection.release();
      return NextResponse.json({ error: "Email or phone number already registered" }, { status: 409 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const [result] = await connection.execute(
      "INSERT INTO users (first_name, last_name, email, phone_no, password) VALUES (?, ?, ?, ?, ?)", 
      [firstName, lastName, email, phone_no, hashedPassword]
    );

    connection.release();
    
    return NextResponse.json({ message: "Signup successful!", userId: result.insertId }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) connection.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
