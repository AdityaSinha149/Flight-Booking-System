import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { airportId } = await request.json();

    if (!airportId) {
      return NextResponse.json(
        { error: "Airport ID is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM airports WHERE airport_id = ?`,
      [airportId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Airport not found or cannot be deleted" },
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
