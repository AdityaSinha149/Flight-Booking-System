import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function DELETE(request) {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);

    // Delete bookings associated with expired flight instances
    const deleteBookingsQuery = `
      DELETE FROM tickets 
      WHERE instance_id IN (
        SELECT fi.instance_id 
        FROM flight_instances fi 
        WHERE fi.departure_time < NOW() AND fi.arrival_time < NOW()
      )
    `;
    await db.query(deleteBookingsQuery);

    // Delete expired flight instances
    const deleteInstancesQuery = `
      DELETE FROM flight_instances 
      WHERE departure_time < NOW() AND arrival_time < NOW()
    `;
    const [result] = await db.query(deleteInstancesQuery);

    await db.end();
    return NextResponse.json({
      success: true,
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
