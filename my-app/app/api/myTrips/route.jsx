import { NextResponse } from "next/server";
import db from "@/lib/db";

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
    
    // First query: Get active bookings
    const activeQuery = `
      SELECT 
        t.ticket_id,
        t.instance_id,
        fi.flight_no,
        fi.airline_name AS airline,
        fr.departure_airport_id AS departure_airport,
        fr.arrival_airport_id AS arrival_airport,
        TIME_FORMAT(TIMEDIFF(fi.arrival_time, fi.departure_time), '%H:%i:%s') AS duration,
        fi.departure_time AS departure_datetime,
        DATE_FORMAT(fi.departure_time, '%Y-%m-%d %h:%i %p') AS departure,
        fi.arrival_time AS arrival_datetime,
        DATE_FORMAT(fi.arrival_time, '%Y-%m-%d %h:%i %p') AS arrival,
        t.seat_number,
        CONCAT(t.first_name, ' ', t.last_name) AS passenger_name,
        t.email AS passenger_email,
        t.phone_no AS passenger_phone,
        t.ticket_id,
        fi.price,
        t.user_id,
        t.booking_time AS booking_date,
        'ACTIVE' AS status
      FROM 
        tickets t
        LEFT JOIN flight_instances fi ON t.instance_id = fi.instance_id
        LEFT JOIN flight_routes fr ON fi.route_id = fr.route_id
      WHERE 
        t.user_id = ?
      ORDER BY 
        t.booking_time DESC
    `;

    // Second query: Get canceled/deleted bookings with improved routes handling using WITH clause
    const canceledQuery = `
      WITH all_routes AS (
        SELECT route_id, departure_airport_id, arrival_airport_id FROM flight_routes
        UNION ALL
        SELECT route_id, departure_airport_id, arrival_airport_id FROM deleted_flight_routes
      )
      SELECT 
        dt.ticket_id,
        dt.instance_id,
        dfi.flight_no,
        dfi.airline_name AS airline,
        r.departure_airport_id AS departure_airport,
        r.arrival_airport_id AS arrival_airport,
        TIME_FORMAT(TIMEDIFF(dfi.arrival_time, dfi.departure_time), '%H:%i:%s') AS duration,
        dfi.departure_time AS departure_datetime,
        DATE_FORMAT(dfi.departure_time, '%Y-%m-%d %h:%i %p') AS departure,
        dfi.arrival_time AS arrival_datetime,
        DATE_FORMAT(dfi.arrival_time, '%Y-%m-%d %h:%i %p') AS arrival,
        dt.seat_number,
        dt.name AS passenger_name,
        dt.email AS passenger_email,
        dt.phone_no AS passenger_phone,
        dt.ticket_id,
        dfi.price,
        dt.user_id,
        dt.booking_time AS booking_date,
        CASE
          WHEN dfi.departure_time > NOW() THEN 'CANCELED'
          ELSE 'COMPLETED'
        END AS status,
        dt.deleted_at
      FROM 
        deleted_tickets dt
        JOIN deleted_flight_instances dfi ON dt.instance_id = dfi.instance_id
        LEFT JOIN all_routes r ON dfi.route_id = r.route_id
      WHERE 
        dt.user_id = ?
      ORDER BY 
        dt.booking_time DESC
    `;

    // Execute both queries using direct db.execute
    const [activeRows] = await db.execute(activeQuery, [user_id]);
    const [canceledRows] = await db.execute(canceledQuery, [user_id]);
    const allRows = [...activeRows, ...canceledRows];
    
    if (allRows.length === 0) {
      return NextResponse.json([]);
    }
    
    const trips = {};
    allRows.forEach(row => {
      // Create a composite key using both instance_id and booking date (YYYY-MM-DD)
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
          departure: row.departure,
          arrival_datetime: row.arrival_datetime,
          arrival: row.arrival,
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
        // Convert seat numbers to integers for proper numerical sorting
        const seatA = parseInt(a.seat_number) || 0;
        const seatB = parseInt(b.seat_number) || 0;
        return seatA - seatB;
      });
    });

    return NextResponse.json(Object.values(trips));
    
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
