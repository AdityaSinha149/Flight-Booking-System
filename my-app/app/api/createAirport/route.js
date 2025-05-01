import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { airportId, location } = await request.json();
    
    // Check if airport already exists
    const { rows: existing } = await pool.query(
      "SELECT 1 FROM airports WHERE airport_id = $1",
      [airportId]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Airport with code ${airportId} already exists` 
      }, { status: 409 });
    }
    
    // Insert the new airport - updated for new table structure
    await pool.query(
      "INSERT INTO airports (airport_id, location) VALUES ($1, $2)",
      [airportId, location]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to add airport" 
    }, { status: 500 });
  }
}
