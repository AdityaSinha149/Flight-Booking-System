import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT airline_name FROM airlines ORDER BY airline_name");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
