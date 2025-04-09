import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function GET(request) {
  const airline = request.nextUrl?.searchParams?.get("airline") || "";
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
        fi.instance_id, 
        fi.flight_no, 
        fi.departure_time, 
        fi.arrival_time, 
        fi.price,
        fr.departure_airport_id,
        fr.arrival_airport_id,
        f.max_seat,
        CASE 
          WHEN fi.arrival_time > NOW() THEN 'Active'
          ELSE 'Expired'
        END AS status,
        COUNT(t.ticket_id) AS booked_seats
      FROM flight_instances fi
      JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
      JOIN flight_routes fr ON fi.route_id = fr.route_id
      LEFT JOIN tickets t ON fi.instance_id = t.instance_id
      WHERE f.airline_name = ?
      GROUP BY fi.instance_id
      ORDER BY fi.departure_time
    `;
    const [rows] = await connection.execute(query, [airline]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}