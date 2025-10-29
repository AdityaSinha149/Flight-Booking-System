import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request) {
  try {
    // Try to parse the request body
    let reqBody;
    try {
      reqBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { user_id } = reqBody;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // First query: Get active bookings with flight details (PostgreSQL syntax)
    const activeResult = await pool.query(`
      SELECT 
        t.ticket_id,
        t.instance_id,
        t.seat_number,
        t.first_name || ' ' || t.last_name AS passenger_name,
        t.email AS passenger_email,
        t.phone_no AS passenger_phone,
        t.user_id,
        t.booking_time AS booking_date,
        fi.flight_no,
        fi.airline_name AS airline,
        fi.departure_time AS departure_datetime,
        fi.arrival_time AS arrival_datetime,
        fi.price,
        fr.departure_airport_id AS departure_airport,
        fr.arrival_airport_id AS arrival_airport,
        TO_CHAR(fi.arrival_time - fi.departure_time, 'HH24:MI') AS duration,
        'ACTIVE' AS status
      FROM 
        tickets t
        LEFT JOIN flight_instances fi ON t.instance_id = fi.instance_id
        LEFT JOIN flight_routes fr ON fi.route_id = fr.route_id
      WHERE 
        t.user_id = $1
      ORDER BY 
        t.booking_time DESC
    `, [user_id]);

    // Second query: Get canceled/deleted bookings (if deleted_tickets table exists)
    let canceledResult = { rows: [] };
    try {
      canceledResult = await pool.query(`
        SELECT 
          dt.ticket_id,
          dt.instance_id,
          dt.seat_number,
          dt.first_name || ' ' || dt.last_name AS passenger_name,
          dt.email AS passenger_email,
          dt.phone_no AS passenger_phone,
          dt.user_id,
          dt.booking_time AS booking_date,
          dfi.flight_no,
          dfi.airline_name AS airline,
          dfi.departure_time AS departure_datetime,
          dfi.arrival_time AS arrival_datetime,
          dfi.price,
          dfr.departure_airport_id AS departure_airport,
          dfr.arrival_airport_id AS arrival_airport,
          TO_CHAR(dfi.arrival_time - dfi.departure_time, 'HH24:MI') AS duration,
          'CANCELED' AS status,
          dt.deleted_at
        FROM 
          deleted_tickets dt
          LEFT JOIN deleted_flight_instances dfi ON dt.instance_id = dfi.instance_id
          LEFT JOIN deleted_flight_routes dfr ON dfi.route_id = dfr.route_id
        WHERE 
          dt.user_id = $1
        ORDER BY 
          dt.booking_time DESC
      `, [user_id]);
    } catch (err) {
      console.log('deleted_tickets table may not exist, skipping:', err.message);
    }

    const allRows = [...activeResult.rows, ...canceledResult.rows];
    
    if (allRows.length === 0) {
      return NextResponse.json([]);
    }
    
    // Group tickets by instance_id and booking date
    const trips = {};
    allRows.forEach(row => {
      const bookingDate = new Date(row.booking_date).toISOString().split('T')[0];
      const tripKey = `${row.instance_id}_${bookingDate}_${row.status}`;
      
      if (!trips[tripKey]) {
        trips[tripKey] = {
          instance_id: row.instance_id,
          flight_no: row.flight_no,
          airline: row.airline,
          departure_airport: row.departure_airport,
          arrival_airport: row.arrival_airport,
          duration: row.duration,
          departure_datetime: row.departure_datetime,
          arrival_datetime: row.arrival_datetime,
          booking_date: row.booking_date,
          price: row.price,
          status: row.status,
          deleted_at: row.deleted_at || null,
          passengers: []
        };
      }
      
      trips[tripKey].passengers.push({
        ticket_id: row.ticket_id,
        seat_number: row.seat_number,
        name: row.passenger_name,
        email: row.passenger_email,
        phone: row.passenger_phone
      });
    });
    
    // Sort passengers by seat number for each trip
    Object.values(trips).forEach(trip => {
      trip.passengers.sort((a, b) => {
        const seatA = parseInt(a.seat_number) || 0;
        const seatB = parseInt(b.seat_number) || 0;
        return seatA - seatB;
      });
    });

    const sortedTrips = Object.values(trips).sort((a, b) => {
      return new Date(b.booking_date) - new Date(a.booking_date);
    });

    return NextResponse.json(sortedTrips);
    
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
