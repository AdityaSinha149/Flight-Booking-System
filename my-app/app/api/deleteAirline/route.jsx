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
    const { airlineName } = await request.json();

    if (!airlineName) {
      return NextResponse.json(
        { error: "Airline name is required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);
    
    // Delete the airline without checking for admins or flights
    const query = `DELETE FROM airlines WHERE airline_name = ?`;
    const [result] = await db.execute(query, [airlineName]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Airline not found" },
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
