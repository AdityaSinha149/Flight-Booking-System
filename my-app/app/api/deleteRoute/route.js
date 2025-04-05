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
    const { routeId } = await request.json();

    if (!routeId) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);
    const query = `DELETE FROM flight_routes WHERE route_id = ?`;
    const [result] = await db.execute(query, [routeId]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Route not found or cannot be deleted" },
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
