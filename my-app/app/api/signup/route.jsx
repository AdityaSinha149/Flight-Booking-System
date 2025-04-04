import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req) {
  let connection;
  try {
    const { firstName, lastName, email, phone_no, password } = await req.json();

    if (!firstName || !lastName || !email || !phone_no || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if email or phone number already exists
    const [existingUser] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ? OR phone_no = ?", 
      [email, phone_no]
    );

    if (existingUser.length) {
      await connection.rollback();
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

    await connection.commit();
    connection.release();
    
    return NextResponse.json({ message: "Signup successful!", userId: result.insertId }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
