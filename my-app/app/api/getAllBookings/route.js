import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    db = await mysql.createConnection(dbConfig);

    let query = `
      SELECT 
        t.ticket_id,
        t.seat_number,
        CONCAT(t.first_name, ' ', t.last_name) AS passenger_name,
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
      query += " WHERE f.airline_name = ?";
      params.push(airline);
    }

    query += " ORDER BY f.airline_name, t.seat_number";

    const [bookings] = await db.execute(query, params);

    await db.end();
    return NextResponse.json(bookings);
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
