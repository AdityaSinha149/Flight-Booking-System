import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { firstName, lastName, email, phone, password, airline } = await request.json();

    if (!firstName || !lastName || !email || !phone || !password || !airline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admin (first_name, last_name, email, phone_no, pass, airline_name) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstName, lastName, email, phone, hashedPassword, airline]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}
