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

    // Start transaction
    await client.query('BEGIN');

    // Insert a ticket row per passenger/seat
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      const seat = seats[i] || seats[0];
      // Insert into tickets. Schema expected: first_name, last_name, email, phone_no, seat_number, user_id, instance_id, booking_time
      await client.query(
        `INSERT INTO tickets (first_name, last_name, email, phone_no, seat_number, user_id, instance_id, booking_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())`,
        [p.firstName || null, p.lastName || null, p.email || null, p.phone || null, seat, user_id, instance_id]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true, message: 'Booking created.' });

  } catch (error) {
    console.error("Database Error:", error);
    if (client) client.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
