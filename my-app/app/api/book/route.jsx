import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  let connection;
  try {
    const { instance_id, passengers, user_id, seats } = await req.json();
    
    if (!instance_id || !passengers || !user_id || !seats || passengers.length === 0 || seats.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    connection = await db.getConnection();
    
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
    
    return NextResponse.json({ success: true, message: "Booking created." });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) connection.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
