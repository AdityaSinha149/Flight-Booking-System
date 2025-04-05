import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const { instance_id, passengers, user_id, seats, } = await req.json();
    
    if (!instance_id || !passengers || !user_id || !seats || passengers.length === 0 || seats.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
    });
    
    const firstNames = passengers.map(p => p.firstName).join(",");
    const lastNames = passengers.map(p => p.lastName).join(",");
    const emails = passengers.map(p => p.email).join(",");
    const phones = passengers.map(p => p.phone).join(",");
    const seatNumbers = seats.join(",");

    await connection.query("CALL InsertTickets(?,?,?,?,?,?,?)", [
      firstNames,
      lastNames,
      emails,
      phones,
      user_id,
      instance_id,
      seatNumbers
    ]);
    
    await connection.end();
    return NextResponse.json({ success: true, message: "Booking created." });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) await connection.end();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
