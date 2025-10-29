import { NextResponse } from 'next/server';
import { pool } from "@/lib/db";
import { sendAllCancellationNotifications } from "@/lib/notifications";

export async function DELETE(request) {
  const instanceId = request.nextUrl?.searchParams?.get("instanceId");
  
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instance ID" }, { status: 400 });
  }
  
  try {
    // Start a transaction to ensure all operations succeed or fail together
    await pool.query('BEGIN');
    
    // Get flight and passenger details for notifications BEFORE deletion
    const flightAndPassengers = await pool.query(`
      SELECT 
        t.first_name,
        t.last_name,
        t.email,
        t.phone_no,
        t.seat_number,
        t.ticket_id,
        fi.flight_no,
        fi.airline_name,
        fi.price,
        fr.departure_airport_id,
        fr.arrival_airport_id
      FROM tickets t
      LEFT JOIN flight_instances fi ON t.instance_id = fi.instance_id
      LEFT JOIN flight_routes fr ON fi.route_id = fr.route_id
      WHERE t.instance_id = $1
    `, [instanceId]);
    
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
    
    // Send cancellation notifications to all passengers (async, don't block response)
    if (flightAndPassengers.rows.length > 0) {
      flightAndPassengers.rows.forEach(async (passenger) => {
        try {
          await sendAllCancellationNotifications({
            passengerEmail: passenger.email,
            passengerName: `${passenger.first_name} ${passenger.last_name}`,
            phoneNumber: passenger.phone_no,
            flightNumber: passenger.flight_no,
            airline: passenger.airline_name,
            departureAirport: passenger.departure_airport_id,
            arrivalAirport: passenger.arrival_airport_id,
            bookingId: `TKT${passenger.ticket_id}`,
            refundAmount: passenger.price,
            reason: 'Flight instance canceled by airline',
          });
        } catch (notifError) {
          console.error('Error sending cancellation notification:', notifError);
        }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error("Error deleting instance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}