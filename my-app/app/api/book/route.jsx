import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const { instance_id, passengers, user_id, seats } = await req.json();
    
    if (!instance_id || !passengers || !user_id || !seats) {
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
    
    const names = passengers.map(p => p.name).join(",");
    const emails = passengers.map(p => p.email).join(",");
    const phones = passengers.map(p => p.phone).join(",");
    const seatNumbers = seats.join(",");

    await connection.query("CALL InsertTickets(?,?,?,?,?,?)", [
      names,
      emails,
      phones,
      user_id,
      instance_id,
      seatNumbers
    ]);
    
    await connection.end();
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) await connection.end();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
