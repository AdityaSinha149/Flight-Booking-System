import { NextResponse } from 'next/server';
import { getConnection } from "@/lib/db";

export async function DELETE(request) {
  const flightNo = request.nextUrl?.searchParams?.get("flightNo");
  const airline = request.nextUrl?.searchParams?.get("airline");
  
  if (!flightNo || !airline) {
    return NextResponse.json({ success: false, error: "Missing flight number or airline" }, { status: 400 });
  }
  
  let connection;
  try {
    connection = await getConnection();

    // Start a transaction for safety
    await connection.beginTransaction();

    // First delete all instances of this flight
    await connection.execute(
      "DELETE FROM flight_instances WHERE flight_no = ?", 
      [flightNo]
    );

    // Then delete the flight itself
    await connection.execute(
      "DELETE FROM flights WHERE flight_no = ? AND airline_name = ?", 
      [flightNo, airline]
    );

    // Commit the transaction
    await connection.commit();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Rollback on error
    if (connection) {
      await connection.rollback();
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
