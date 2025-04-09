import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });

    const [rows] = await connection.execute("SELECT * FROM flight_routes", []);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(request) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });
    const { departureAirport, arrivalAirport } = await request.json();
    
    // Check for missing parameters
    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameters: departure and arrival airports" 
      }, { status: 400 });
    }
    
    // Look for existing route
    const [existing] = await connection.execute(
      "SELECT route_id FROM flight_routes WHERE departure_airport_id=? AND arrival_airport_id=?",
      [departureAirport, arrivalAirport]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ success: true, routeId: existing[0].route_id });
    }
    
    // Create new route if it doesn't exist
    const [result] = await connection.execute(
      "INSERT INTO flight_routes (departure_airport_id, arrival_airport_id) VALUES (?, ?)",
      [departureAirport, arrivalAirport]
    );
    
    // Get the newly inserted ID
    const newRouteId = result.insertId;
    return NextResponse.json({ success: true, routeId: newRouteId });
  } catch (error) {
    console.error("getRoutes POST error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create route"
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
