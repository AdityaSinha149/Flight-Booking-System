import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";

export async function DELETE(request) {
  const flightNo = request.nextUrl?.searchParams?.get("flightNo");
  const airline = request.nextUrl?.searchParams?.get("airline");
  
  if (!flightNo || !airline) {
    return NextResponse.json({ success: false, error: "Missing flight number or airline" }, { status: 400 });
  }
  
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // 1. Get all instances for this flight
    const instances = await pool.query(
      "SELECT instance_id FROM flight_instances WHERE flight_no = $1 AND airline_name = $2",
      [flightNo, airline]
    );
    
    // 2. For each instance, backup and delete tickets
    for (const instance of instances.rows) {
      const instanceId = instance.instance_id;
      
      // Backup tickets to deleted_tickets
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
      
      // Delete tickets
      await pool.query("DELETE FROM tickets WHERE instance_id = $1", [instanceId]);
    }
    
    // 3. Backup flight instances to deleted_flight_instances
    await pool.query(`
      INSERT INTO deleted_flight_instances (
        instance_id, flight_no, airline_name, route_id,
        departure_time, arrival_time, price
      )
      SELECT
        instance_id, flight_no, airline_name, route_id,
        departure_time, arrival_time, price
      FROM flight_instances
      WHERE flight_no = $1 AND airline_name = $2
    `, [flightNo, airline]);
    
    // 4. Delete flight instances
    await pool.query(
      "DELETE FROM flight_instances WHERE flight_no = $1 AND airline_name = $2",
      [flightNo, airline]
    );
    
    // 5. Backup flight to deleted_flights
    await pool.query(`
      INSERT INTO deleted_flights (flight_no, airline_name, max_seat)
      SELECT flight_no, airline_name, max_seat
      FROM flights
      WHERE flight_no = $1 AND airline_name = $2
    `, [flightNo, airline]);
    
    // 6. Finally delete the flight
    const { rowCount } = await pool.query(
      "DELETE FROM flights WHERE flight_no = $1 AND airline_name = $2",
      [flightNo, airline]
    );

    if (rowCount === 0) {
      await pool.query('ROLLBACK');
      return NextResponse.json({ success: false, error: "Flight not found" }, { status: 404 });
    }
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error("Error deleting flight:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
