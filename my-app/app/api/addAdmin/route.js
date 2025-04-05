import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from 'bcrypt';

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function POST(request) {
  let db;
  try {
    const { firstName, lastName, email, phone, password, airline } = await request.json();

    if (!firstName || !lastName || !email || !phone || !password || !airline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO admin (first_name, last_name, email, phone_no, pass, airline_name) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [firstName, lastName, email, phone, hashedPassword, airline]);

    await db.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}
