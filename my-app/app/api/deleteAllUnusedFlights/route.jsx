import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    if (!airline) {
      return NextResponse.json(
        { error: "Airline is required" },
        { status: 400 }
      );
    }

    // Delete unused flights
    const [result] = await db.execute(`
      DELETE FROM flights
      WHERE airline_name = ?
      AND flight_no NOT IN (
        SELECT DISTINCT flight_no
        FROM flight_instances
        WHERE airline_name = ?
      )
    `, [airline, airline]);

    return NextResponse.json({
      success: true,
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
