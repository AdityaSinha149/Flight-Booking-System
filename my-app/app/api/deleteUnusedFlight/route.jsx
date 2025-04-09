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
    const flightNo = searchParams.get("flightNo");
    const airline = searchParams.get("airline");

    if (!flightNo || !airline) {
      return NextResponse.json(
        { error: "Flight number and airline are required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);

    // Check if the flight has any instances
    const checkInstancesQuery = `
      SELECT COUNT(*) AS count 
      FROM flight_instances 
      WHERE flight_no = ? AND airline_name = ?
    `;
    const [instancesResult] = await db.execute(checkInstancesQuery, [flightNo, airline]);

    if (instancesResult[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete flight with existing instances. Delete instances first." },
        { status: 400 }
      );
    }

    // Delete the flight
    const query = `DELETE FROM flights WHERE flight_no = ? AND airline_name = ?`;
    const [result] = await db.execute(query, [flightNo, airline]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Flight not found or cannot be deleted" },
        { status: 404 }
      );
    }

    await db.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
