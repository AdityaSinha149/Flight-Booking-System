import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const { airline, flight_no, passengers, user_id } = await req.json();
    connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
    });
    const names = passengers.map(p => p.name).join(",");
    const emails = passengers.map(p => p.email).join(",");
    const phones = passengers.map(p => p.phone).join(",");
    const seatNumbers = passengers.map(p => p.seatNumber).join(",");

    await connection.query("CALL InsertTickets(?,?,?,?,?,?,?)", [
      names,
      emails,
      phones,
      user_id,
      flight_no,
      seatNumbers,
      airline
    ]);
    await connection.end();
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) await connection.end();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
