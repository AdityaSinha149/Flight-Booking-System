import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  let connection;
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
    connection = await db.getConnection();
    const [checkRows] = await connection.execute(checkQuery, [newContact, adminId]);

    if (checkRows.length > 0) {
      connection.release();
      return NextResponse.json(
        { error: `This ${type} is already in use by another admin` },
        { status: 400 }
      );
    }

    // Update the contact
    await connection.execute(query, [newContact, adminId]);

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
