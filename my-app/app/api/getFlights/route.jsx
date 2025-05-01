import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function GET(request) {
  const airline = request.nextUrl?.searchParams?.get('airline');

  if (!airline) {
    return NextResponse.json({ error: "Airline parameter is required" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      "SELECT flight_no, airline_name, max_seat FROM flights WHERE airline_name = $1",
      [airline]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
