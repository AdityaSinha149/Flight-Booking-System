import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function POST(request) {
  let db;
  try {
    const { adminId, newContact, type } = await request.json();

    if (!adminId || !newContact || !type) {
      return NextResponse.json(
        { error: "Admin ID, new contact, and type are required" },
        { status: 400 }
      );
    }

    let query;
    let checkQuery;
    let fieldName;

    if (type === "phone") {
      fieldName = "phone_no";
      checkQuery = `SELECT admin_id FROM admin WHERE phone_no = ? AND admin_id != ?`;
      query = `UPDATE admin SET phone_no = ? WHERE admin_id = ?`;
    } else if (type === "email") {
      fieldName = "email";
      checkQuery = `SELECT admin_id FROM admin WHERE email = ? AND admin_id != ?`;
      query = `UPDATE admin SET email = ? WHERE admin_id = ?`;
    } else {
      return NextResponse.json({ error: "Invalid contact type" }, { status: 400 });
    }

    // Check if the contact is already in use
    db = await mysql.createConnection(dbConfig);
    const [checkRows] = await db.execute(checkQuery, [newContact, adminId]);

    if (checkRows.length > 0) {
      return NextResponse.json(
        { error: `This ${type} is already in use by another admin` },
        { status: 400 }
      );
    }

    // Update the contact
    await db.execute(query, [newContact, adminId]);

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
