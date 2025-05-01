import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function DELETE(request) {
  const flightNo = request.nextUrl?.searchParams?.get("flightNo");
  const airline = request.nextUrl?.searchParams?.get("airline");
  
  if (!flightNo || !airline) {
    return NextResponse.json({ success: false, error: "Missing flight number or airline" }, { status: 400 });
  }
  
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM flights WHERE flight_no = $1 AND airline_name = $2",
      [flightNo, airline]
    );

    if (rowCount === 0) {
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
