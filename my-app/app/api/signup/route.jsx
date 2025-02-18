import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(req) {
  let connection;

  try {
    const { name, email, phone_no, password } = await req.json();

    if (!name || !email || !phone_no || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Establish connection to the MySQL database
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
    });

    // Check if email or phone number already exists
    const [existingUser] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ? OR phone_no = ?",
      [email, phone_no]
    );

    if (existingUser.length) {
      return NextResponse.json({ error: "Email or phone number already registered" }, { status: 409 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, phone_no, password) VALUES (?, ?, ?, ?)",
      [name, email, phone_no, hashedPassword]
    );

    // Close the connection
    await connection.end();

    return NextResponse.json({ message: "Signup successful!", userId: result.insertId }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    
    if (connection) {
      await connection.end();  // Close connection in case of error
    }

    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
