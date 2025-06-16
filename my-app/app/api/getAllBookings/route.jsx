import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    let sql = `
      SELECT 
        t.ticket_id,
        t.seat_number,
        t.first_name || ' ' || t.last_name AS passenger_name,
        t.email AS passenger_email,
        t.phone_no AS passenger_phone,
        t.booking_time,
        fi.instance_id,
        fi.departure_time,
        fi.arrival_time,
        fi.price,
        f.flight_no,
        f.airline_name,
        r.departure_airport_id,
        r.arrival_airport_id
      FROM tickets t
      JOIN flight_instances fi ON t.instance_id = fi.instance_id
      JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
      JOIN flight_routes r ON fi.route_id = r.route_id
    `;

    let params = [];
    if (airline) {
      sql += " WHERE f.airline_name = $1";
      params.push(airline);
    }

    sql += " ORDER BY f.airline_name, t.seat_number";

    console.log("SQL Query:", sql);
    console.log("Params:", params);
    const { rows: bookings } = await pool.query(sql, params);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
