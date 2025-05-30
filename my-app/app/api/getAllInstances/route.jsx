import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request) {
  try {
    const { rows: instances } = await pool.query(`
      SELECT fi.*, f.airline_name, r.departure_airport_id, r.arrival_airport_id
      FROM flight_instances fi
      JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
      JOIN flight_routes r ON fi.route_id = r.route_id
      ORDER BY fi.departure_time DESC
    `);
    
    return NextResponse.json(instances);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
