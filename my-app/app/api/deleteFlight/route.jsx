import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function DELETE(request) {
  const flightNo = request.nextUrl?.searchParams?.get("flightNo");
  const airline = request.nextUrl?.searchParams?.get("airline");
  
  if (!flightNo || !airline) {
    return NextResponse.json({ success: false, error: "Missing flight number or airline" }, { status: 400 });
  }
  
  try {
    const sql = "DELETE FROM flights WHERE flight_no = ? AND airline_name = ?";
    const [result] = await db.execute(sql, [flightNo, airline]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
