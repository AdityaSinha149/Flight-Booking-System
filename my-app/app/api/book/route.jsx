import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { sendAllBookingNotifications } from "@/lib/notifications";

export async function POST(req) {
  let client;
  try {
    const { instance_id, passengers, user_id, seats, amount } = await req.json();
    
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

    // Get flight details for notifications
    const flightDetails = await client.query(
      `SELECT 
        fi.flight_no, 
        fi.airline_name,
        fr.departure_airport_id,
        fr.arrival_airport_id,
        fi.departure_time,
        fi.arrival_time,
        fi.price
      FROM flight_instances fi
      LEFT JOIN flight_routes fr ON fi.route_id = fr.route_id
      WHERE fi.instance_id = $1`,
      [instance_id]
    );

    // Send notifications to all passengers
    if (flightDetails.rows.length > 0) {
      const flight = flightDetails.rows[0];
      
      // Send notification for each passenger (async, don't wait)
      passengers.forEach(async (passenger, index) => {
        try {
          await sendAllBookingNotifications({
            passengerEmail: passenger.email,
            passengerName: `${passenger.firstName} ${passenger.lastName}`,
            phoneNumber: passenger.phone,
            flightNumber: flight.flight_no,
            airline: flight.airline_name,
            departureAirport: flight.departure_airport_id,
            arrivalAirport: flight.arrival_airport_id,
            departureTime: flight.departure_time,
            arrivalTime: flight.arrival_time,
            seatNumber: seats[index] || seats[0],
            bookingId: `BK${Date.now()}${index}`,
            amount: amount || flight.price,
          });
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
          // Don't fail the booking if notification fails
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Booking created.' });

  } catch (error) {
    console.error("Database Error:", error);
    if (client) client.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
