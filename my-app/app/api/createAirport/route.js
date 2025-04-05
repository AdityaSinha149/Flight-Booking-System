import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function POST(request) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });
    
    const { airportId, name, location } = await request.json();
    
    // Check if airport already exists
    const [existing] = await connection.execute(
      "SELECT * FROM airports WHERE airport_id = ?",
      [airportId]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Airport with code ${airportId} already exists` 
      }, { status: 409 });
    }
    
    // Insert the new airport
    await connection.execute(
      "INSERT INTO airports (airport_id, name, location) VALUES (?, ?, ?)",
      [airportId, name, location]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to add airport" 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
