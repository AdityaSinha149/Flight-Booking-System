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

    const { routeId, flightNo, airlineName, departureTime, arrivalTime, price } = await request.json();
    
    // Server-side validation: Check if departure time is before arrival time
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    
    if (departureDate >= arrivalDate) {
      return NextResponse.json({ 
        success: false, 
        message: "Departure time must be before arrival time."
      }, { status: 400 });
    }

    const [checkRows] = await connection.execute(
      "SELECT * FROM flight_instances WHERE flight_no = ? AND airline_name = ? AND departure_time = ?",
      [flightNo, airlineName, departureTime]
    );
    
    if (checkRows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Flight instance already exists at this departure time."
      });
    }

    await connection.execute(
      "INSERT INTO flight_instances (route_id, flight_no, airline_name, departure_time, arrival_time, price) VALUES (?, ?, ?, ?, ?, ?)",
      [routeId, flightNo, airlineName, departureTime, arrivalTime, price]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
