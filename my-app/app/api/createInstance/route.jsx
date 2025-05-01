import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    const { routeId, flightNo, airlineName, departureTime, arrivalTime, price } = await request.json();
    
    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);
    
    if (departureDate >= arrivalDate) {
      return NextResponse.json({ 
        success: false, 
        message: "Departure time must be before arrival time."
      }, { status: 400 });
    }

    const { rows: checkRows } = await pool.query(
      "SELECT 1 FROM flight_instances WHERE flight_no = $1 AND airline_name = $2 AND departure_time = $3",
      [flightNo, airlineName, departureTime]
    );
    
    if (checkRows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Flight instance already exists at this departure time."
      });
    }

    await pool.query(
      "INSERT INTO flight_instances (route_id, flight_no, airline_name, departure_time, arrival_time, price) VALUES ($1, $2, $3, $4, $5, $6)",
      [routeId, flightNo, airlineName, departureTime, arrivalTime, price]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
