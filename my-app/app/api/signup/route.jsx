import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone_no, password } = await req.json();

    if (!firstName || !lastName || !email || !phone_no || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email or phone number already exists
    const { rows: existingUser } = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 OR phone_no = $2",
      [email, phone_no]
    );

    if (existingUser.length) {
      return NextResponse.json({ error: "Email or phone number already registered" }, { status: 409 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const { rows: inserted } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone_no, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id",
      [firstName, lastName, email, phone_no, hashedPassword]
    );

    return NextResponse.json({ message: "Signup successful!", userId: inserted[0].user_id }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
