import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { departureAirport, arrivalAirport } = await request.json();

    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters: departure and arrival airports"
      }, { status: 400 });
    }

    const { rows: routes } = await pool.query(
      "SELECT route_id FROM flight_routes WHERE departure_airport_id=$1 AND arrival_airport_id=$2",
      [departureAirport, arrivalAirport]
    );

    if (routes.length > 0) {
      return NextResponse.json({ success: true, routeId: routes[0].route_id });
    }

    const { rows: insertResult } = await pool.query(
      "INSERT INTO flight_routes (departure_airport_id, arrival_airport_id) VALUES ($1, $2) RETURNING route_id",
      [departureAirport, arrivalAirport]
    );

    const newRouteId = insertResult[0].route_id;
    return NextResponse.json({ success: true, routeId: newRouteId });
  } catch (error) {
    console.error("getRoutes POST error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create route"
    }, { status: 500 });
  }
}
