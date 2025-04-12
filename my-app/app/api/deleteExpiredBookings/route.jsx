import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
  try {
    // Delete expired bookings
    const [result] = await db.execute(`
      DELETE FROM tickets
      WHERE instance_id IN (
        SELECT instance_id
        FROM flight_instances
        WHERE arrival_time < NOW()
      )
    `);

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
