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

    const { flightNo, airlineName, capacity } = await request.json();

    // Validate capacity
    const maxSeat = parseInt(capacity);
    if (!maxSeat || maxSeat <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Flight capacity must be a positive number" 
      }, { status: 400 });
    }

    const [checkRows] = await connection.execute(
      "SELECT * FROM flights WHERE flight_no = ? AND airline_name = ?",
      [flightNo, airlineName]
    );
    if (checkRows.length > 0) {
      return NextResponse.json({ success: true, message: "Flight already exists" });
    }

    // Use max_seat instead of maxSeat in the INSERT statement
    await connection.execute(
      "INSERT INTO flights (flight_no, airline_name, max_seat) VALUES (?, ?, ?)",
      [flightNo, airlineName, maxSeat] // still using 'maxSeat' variable from payload
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
