import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    connection = await db.getConnection();
    
    const { airportId, location } = await request.json();
    
    // Check if airport already exists
    const [existing] = await connection.execute(
      "SELECT * FROM airports WHERE airport_id = ?",
      [airportId]
    );
    
    if (existing.length > 0) {
      connection.release();
      return NextResponse.json({ 
        success: false, 
        error: `Airport with code ${airportId} already exists` 
      }, { status: 409 });
    }
    
    // Insert the new airport - updated for new table structure
    await connection.execute(
      "INSERT INTO airports (airport_id, location) VALUES (?, ?)",
      [airportId, location]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    if (connection) connection.release();
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to add airport" 
    }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
