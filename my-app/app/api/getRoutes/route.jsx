import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { departureAirport, arrivalAirport } = await request.json();

    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json({
        success: false,
        error: "Missing required parameters: departure and arrival airports"
      }, { status: 400 });
    }

    const [routes] = await db.execute(
      "SELECT route_id FROM flight_routes WHERE departure_airport_id=? AND arrival_airport_id=?",
      [departureAirport, arrivalAirport]
    );

    if (routes.length > 0) {
      return NextResponse.json({ success: true, routeId: routes[0].route_id });
    }

    const [result] = await db.execute(
      "INSERT INTO flight_routes (departure_airport_id, arrival_airport_id) VALUES (?, ?)",
      [departureAirport, arrivalAirport]
    );

    const newRouteId = result.insertId;
    return NextResponse.json({ success: true, routeId: newRouteId });
  } catch (error) {
    console.error("getRoutes POST error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create route"
    }, { status: 500 });
  }
}
