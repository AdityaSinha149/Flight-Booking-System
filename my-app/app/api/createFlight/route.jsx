import { NextResponse } from 'next/server';
import db from "@/lib/db";

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

    const [checkRows] = await db.execute(
      "SELECT * FROM flights WHERE flight_no = ? AND airline_name = ?",
      [flightNo, airlineName]
    );

    if (checkRows.length > 0) {
      return NextResponse.json({ success: true, message: "Flight already exists" });
    }

    await db.execute(
      "INSERT INTO flights (flight_no, airline_name, max_seat) VALUES (?, ?, ?)",
      [flightNo, airlineName, maxSeat]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
