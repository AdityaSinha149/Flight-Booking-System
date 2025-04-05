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
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    if (!airline) {
      return NextResponse.json(
        { error: "Airline is required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);

    // Delete unused flights
    const deleteUnusedFlightsQuery = `
      DELETE FROM flights
      WHERE airline_name = ?
      AND flight_no NOT IN (
        SELECT DISTINCT flight_no
        FROM flight_instances
        WHERE airline_name = ?
      )
    `;

    const [result] = await db.execute(deleteUnusedFlightsQuery, [airline, airline]);

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
