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
    const { adminId, newPassword } = await request.json();

    if (!adminId || !newPassword) {
      return NextResponse.json(
        { error: "Admin ID and new password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db = await mysql.createConnection(dbConfig);
    const query = `UPDATE admin SET pass = ? WHERE admin_id = ?`;
    await db.execute(query, [hashedPassword, adminId]);

    await db.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
