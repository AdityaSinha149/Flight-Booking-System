import { NextResponse } from 'next/server';
import { query, getConnection } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM flight_routes");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  let connection;
  try {
    const { departureAirport, arrivalAirport } = await request.json();
    
    // Check for missing parameters
    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameters: departure and arrival airports" 
      }, { status: 400 });
    }
    
    connection = await getConnection();
    
    // Look for existing route
    const [existing] = await connection.execute(
      "SELECT route_id FROM flight_routes WHERE departure_airport_id=? AND arrival_airport_id=?",
      [departureAirport, arrivalAirport]
    );
    
    if (existing.length > 0) {
      connection.release();
      return NextResponse.json({ success: true, routeId: existing[0].route_id });
    }
    
    // Create new route if it doesn't exist
    const [result] = await connection.execute(
      "INSERT INTO flight_routes (departure_airport_id, arrival_airport_id) VALUES (?, ?)",
      [departureAirport, arrivalAirport]
    );
    
    // Get the newly inserted ID
    const newRouteId = result.insertId;
    connection.release();
    return NextResponse.json({ success: true, routeId: newRouteId });
  } catch (error) {
    console.error("getRoutes POST error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create route"
    }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
