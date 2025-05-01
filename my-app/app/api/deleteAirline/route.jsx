import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request) {
  let connection;
  try {
    const { airlineName } = await request.json();

    if (!airlineName) {
      return NextResponse.json(
        { error: "Airline name is required" },
        { status: 400 }
      );
    }

    // Delete the airline without checking for admins or flights
    const { rowCount } = await pool.query(
      "DELETE FROM airlines WHERE airline_name = $1",
      [airlineName]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Airline not found" },
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
