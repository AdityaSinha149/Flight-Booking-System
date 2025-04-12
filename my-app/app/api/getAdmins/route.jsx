import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    if (!airline) {
      return NextResponse.json(
        { error: "Missing airline parameter" },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(`
      SELECT 
        admin_id, 
        CONCAT(first_name, ' ', last_name) AS admin_name, 
        email, 
        pass, 
        phone_no
      FROM admin
      WHERE airline_name = ?
    `, [airline]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}
