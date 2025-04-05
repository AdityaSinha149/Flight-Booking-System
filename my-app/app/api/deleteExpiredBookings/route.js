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

    // Delete expired bookings
    const deleteBookingsQuery = `
      DELETE FROM tickets
      WHERE instance_id IN (
        SELECT instance_id
        FROM flight_instances
        WHERE arrival_time < NOW()
      )
    `;
    const [result] = await db.query(deleteBookingsQuery);

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
