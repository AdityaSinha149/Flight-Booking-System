import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { adminId } = await request.json();

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    const { rowCount } = await pool.query(
      "DELETE FROM admin WHERE admin_id = $1",
      [adminId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
