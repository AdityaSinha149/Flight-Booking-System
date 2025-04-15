import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
  let connection;
  try {
    connection = await db.getConnection();
    
    const [result] = await connection.execute(`
      DELETE FROM flight_instances WHERE departure_time < NOW() AND arrival_time < NOW()
    `);

    connection.release();
    return NextResponse.json({ success: true, deletedCount: result.affectedRows });
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
