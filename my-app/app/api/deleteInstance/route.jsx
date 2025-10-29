import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function DELETE(request) {
  const instanceId = request.nextUrl?.searchParams?.get("instanceId");
  
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instance ID" }, { status: 400 });
  }
  
  try {
    // Start a transaction to ensure all operations succeed or fail together
    await pool.query('BEGIN');
    
    // 1. Backup tickets to deleted_tickets
    await pool.query(`
      INSERT INTO deleted_tickets (
        ticket_id, seat_number, user_id, instance_id,
        first_name, last_name, email, phone_no, booking_time
      )
      SELECT
        ticket_id, seat_number, user_id, instance_id,
        first_name, last_name, email, phone_no, booking_time
      FROM tickets
      WHERE instance_id = $1
    `, [instanceId]);
    
    // 2. Backup the flight instance to deleted_flight_instances
    await pool.query(`
      INSERT INTO deleted_flight_instances (
        instance_id, flight_no, airline_name, route_id,
        departure_time, arrival_time, price
      )
      SELECT
        instance_id, flight_no, airline_name, route_id,
        departure_time, arrival_time, price
      FROM flight_instances
      WHERE instance_id = $1
    `, [instanceId]);
    
    // 3. Delete tickets (children first)
    await pool.query(
      "DELETE FROM tickets WHERE instance_id = $1",
      [instanceId]
    );
    
    // 4. Delete the flight instance
    await pool.query(
      "DELETE FROM flight_instances WHERE instance_id = $1",
      [instanceId]
    );
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error("Error deleting instance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}