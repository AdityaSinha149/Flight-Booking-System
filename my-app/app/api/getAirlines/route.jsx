import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.execute("SELECT airline_name FROM airlines ORDER BY airline_name");
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
