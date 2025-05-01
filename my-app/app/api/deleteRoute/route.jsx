import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { routeId } = await request.json();

    if (!routeId) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    const { rowCount } = await pool.query(
      `DELETE FROM flight_routes WHERE route_id = $1`,
      [routeId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Route not found or cannot be deleted" },
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
