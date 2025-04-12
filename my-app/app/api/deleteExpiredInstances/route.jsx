import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
  let connection;
  try {
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();

    // Delete bookings associated with expired flight instances
    await connection.execute(`
      DELETE FROM tickets 
      WHERE instance_id IN (
        SELECT fi.instance_id 
        FROM flight_instances fi 
        WHERE fi.departure_time < NOW() AND fi.arrival_time < NOW()
      )
    `);

    // Delete expired flight instances
    const [result] = await connection.execute(`
      DELETE FROM flight_instances 
      WHERE departure_time < NOW() AND arrival_time < NOW()
    `);

    await connection.commit();
    
    return NextResponse.json({
      success: true,
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
