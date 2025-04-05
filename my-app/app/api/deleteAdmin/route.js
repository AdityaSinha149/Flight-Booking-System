import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function DELETE(request) {
  let db;
  try {
    const { adminId } = await request.json();

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);
    const query = `DELETE FROM admin WHERE admin_id = ?`;
    const [result] = await db.execute(query, [adminId]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

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
