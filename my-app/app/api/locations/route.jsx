import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await db.getConnection();
    const [locations] = await connection.execute("SELECT airport_id, location FROM airports ORDER BY location");
    
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    if (connection) connection.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

