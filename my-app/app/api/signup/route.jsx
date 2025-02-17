import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, phone_no, password } = await req.json();
    if (!email || !phone_no || !password) 
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "sinha",
      database: "airline_booking",
    });

    console.log("Connected to DB successfully");

    const [existingUser] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ? OR phone_no = ?", 
      [email, phone_no]
    );
    
    if (existingUser.length) {
      connection.end();
      return NextResponse.json({ error: "Email or phone number already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      "INSERT INTO users (email, phone_no, password) VALUES (?, ?, ?)", 
      [email, phone_no, hashedPassword]
    );

    connection.end();
    return NextResponse.json({ message: "Signup successful!", userId: result.insertId }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
