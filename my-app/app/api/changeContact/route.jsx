import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request) {
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
    
    const { rows: checkRows } = await pool.query(
      `SELECT admin_id FROM admin WHERE ${field} = $1 AND admin_id != $2`,
      [newContact, adminId]
    );

    if (checkRows.length > 0) {
      return NextResponse.json(
        { error: `This ${type} is already in use by another admin` },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE admin SET ${field} = $1 WHERE admin_id = $2`,
      [newContact, adminId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
