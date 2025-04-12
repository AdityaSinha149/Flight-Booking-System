import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNo = searchParams.get("flightNo");
    const airline = searchParams.get("airline");

    if (!flightNo || !airline) {
      return NextResponse.json(
        { error: "Flight number and airline are required" },
        { status: 400 }
      );
    }

    // Check if the flight has any instances
    const [instancesResult] = await db.execute(`
      SELECT COUNT(*) AS count 
      FROM flight_instances 
      WHERE flight_no = ? AND airline_name = ?
    `, [flightNo, airline]);

    if (instancesResult[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete flight with existing instances. Delete instances first." },
        { status: 400 }
      );
    }

    // Delete the flight
    const [result] = await db.execute(
      `DELETE FROM flights WHERE flight_no = ? AND airline_name = ?`, 
      [flightNo, airline]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Flight not found or cannot be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
