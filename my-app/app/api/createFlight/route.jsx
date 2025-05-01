import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { flightNo, airlineName, capacity } = await request.json();

    const maxSeat = parseInt(capacity);
    if (!maxSeat || maxSeat <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Flight capacity must be a positive number" 
      }, { status: 400 });
    }

    const { rows: checkRows } = await pool.query(
      "SELECT 1 FROM flights WHERE flight_no = $1 AND airline_name = $2",
      [flightNo, airlineName]
    );

    if (checkRows.length > 0) {
      return NextResponse.json({ success: true, message: "Flight already exists" });
    }

    await pool.query(
      "INSERT INTO flights (flight_no, airline_name, max_seat) VALUES ($1, $2, $3)",
      [flightNo, airlineName, maxSeat]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
