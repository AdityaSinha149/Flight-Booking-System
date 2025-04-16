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

    if (type !== "phone" && type !== "email") {
      return NextResponse.json({ error: "Invalid contact type" }, { status: 400 });
    }
    
    const field = type === "phone" ? "phone_no" : "email";
    
    connection = await db.getConnection();
    const [checkRows] = await connection.execute(
      `SELECT admin_id FROM admin WHERE ${field} = ? AND admin_id != ?`,
      [newContact, adminId]
    );

    if (checkRows.length > 0) {
      connection.release();
      return NextResponse.json(
        { error: `This ${type} is already in use by another admin` },
        { status: 400 }
      );
    }

    await connection.execute(
      `UPDATE admin SET ${field} = ? WHERE admin_id = ?`, 
      [newContact, adminId]
    );

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
