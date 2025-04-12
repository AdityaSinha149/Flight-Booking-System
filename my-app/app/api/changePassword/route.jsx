import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { adminId, newPassword } = await request.json();

    if (!adminId || !newPassword) {
      return NextResponse.json(
        { error: "Admin ID and new password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(`UPDATE admin SET pass = ? WHERE admin_id = ?`, [hashedPassword, adminId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
