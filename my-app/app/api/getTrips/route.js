import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function GET(request) {
  const userId = request.nextUrl?.searchParams?.get("userId") || "";
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });
    
    const query = `
      SELECT 
        t.ticket_id,
        t.instance_id,
        CONCAT(t.first_name, ' ', t.last_name) AS passenger_name,
        t.email AS passenger_email,
        t.phone_no AS passenger_phone,
        t.seat_number,
        fi.flight_no,
        fi.departure_time,
        fi.arrival_time,
        fi.price,
        fi.airline_name,
        fr.departure_airport_id,
        fr.arrival_airport_id,
        f.maxSeat
      FROM tickets t
      JOIN flight_instances fi ON t.instance_id = fi.instance_id
      JOIN flight_routes fr ON fi.route_id = fr.route_id
      JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
      WHERE t.user_id = ?
      ORDER BY fi.departure_time DESC
    `;
    
    const [rows] = await connection.execute(query, [userId]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
