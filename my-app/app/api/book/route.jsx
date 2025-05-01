import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  let client;
  try {
    const { instance_id, passengers, user_id, seats } = await req.json();
    
    if (!instance_id || !passengers || !user_id || !seats || passengers.length === 0 || seats.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    client = await pool.connect();
    
    const firstNames = passengers.map(p => p.firstName).join(",");
    const lastNames = passengers.map(p => p.lastName).join(",");
    const emails = passengers.map(p => p.email).join(",");
    const phones = passengers.map(p => p.phone).join(",");
    const seatNumbers = seats.join(",");

    await client.query("SELECT InsertTickets($1,$2,$3,$4,$5,$6,$7)", [
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
    if (client) client.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
