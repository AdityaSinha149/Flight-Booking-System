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
    
    // First check if there are any flights for this airline
    const checkQuery = `SELECT COUNT(*) as count FROM flights WHERE airline_name = ?`;
    const [checkResult] = await db.execute(checkQuery, [airlineName]);
    
    if (checkResult[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete airline with existing flights. Delete all flights first." },
        { status: 400 }
      );
    }

    // Also check if there are any admins for this airline
    const checkAdminsQuery = `SELECT COUNT(*) as count FROM admin WHERE airline_name = ?`;
    const [checkAdminsResult] = await db.execute(checkAdminsQuery, [airlineName]);
    
    if (checkAdminsResult[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete airline with existing admins. Delete all admins first." },
        { status: 400 }
      );
    }
    
    // Delete the airline
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
