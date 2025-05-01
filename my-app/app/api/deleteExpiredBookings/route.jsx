import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { rowCount } = await pool.query(`
      DELETE FROM tickets
      WHERE instance_id IN (
        SELECT instance_id
        FROM flight_instances
        WHERE arrival_time < NOW()
      )
    `);

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
