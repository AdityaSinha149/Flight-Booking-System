import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const { rows: locations } = await pool.query(`
      SELECT airport_id, location
      FROM airports
      ORDER BY location
    `);
    
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}

