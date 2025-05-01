import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

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
    const { rowCount } = await pool.query(`
      DELETE FROM flights
      WHERE airline_name = $1
      AND flight_no NOT IN (
        SELECT DISTINCT flight_no
        FROM flight_instances
        WHERE airline_name = $1
      )
    `, [airline]);

    return NextResponse.json({
      success: true,
      deletedCount: rowCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
