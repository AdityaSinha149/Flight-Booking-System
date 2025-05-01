import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request) {
  try {
    const { rowCount } = await pool.query(`
      DELETE FROM flight_instances
      WHERE departure_time < NOW() AND arrival_time < NOW()
    `);

    return NextResponse.json({ success: true, deletedCount: rowCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
