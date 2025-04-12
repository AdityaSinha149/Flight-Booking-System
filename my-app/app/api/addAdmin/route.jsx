import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import db from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    const { firstName, lastName, email, phone, password, airline } = await request.json();

    if (!firstName || !lastName || !email || !phone || !password || !airline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await db.getConnection();
    const query = `
      INSERT INTO admin (first_name, last_name, email, phone_no, pass, airline_name) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [firstName, lastName, email, phone, hashedPassword, airline]);

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json(
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}
