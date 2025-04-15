import { NextResponse } from 'next/server';
import db from "@/lib/db";

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

    const [checkRows] = await db.execute(
      "SELECT * FROM flight_instances WHERE flight_no = ? AND airline_name = ? AND departure_time = ?",
      [flightNo, airlineName, departureTime]
    );
    
    if (checkRows.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Flight instance already exists at this departure time."
      });
    }

    await db.execute(
      "INSERT INTO flight_instances (route_id, flight_no, airline_name, departure_time, arrival_time, price) VALUES (?, ?, ?, ?, ?, ?)",
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
