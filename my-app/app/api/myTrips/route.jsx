import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function POST(request) {
  let db;
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

    console.log(`Fetching trips for user_id: ${user_id}`);
    
    // Connect to database
    try {
      db = await mysql.createConnection(dbConfig);
    } catch (dbConnectError) {
      console.error("Database connection error:", dbConnectError);
      return NextResponse.json(
        { error: "Failed to connect to database", details: dbConnectError.message },
        { status: 500 }
      );
    }
    
    // Updated query to handle potential missing join issues
    const query = `
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
        t.booking_time AS booking_date
      FROM 
        tickets t
        LEFT JOIN flight_instances fi ON t.instance_id = fi.instance_id
        LEFT JOIN flight_routes fr ON fi.route_id = fr.route_id
      WHERE 
        t.user_id = ?
      ORDER BY 
      t.booking_time DESC
    `;

    // Try executing the query
    let rows;
    try {
      [rows] = await db.execute(query, [user_id]);
      console.log(`Found ${rows.length} ticket records`);
    } catch (queryError) {
      console.error("Query execution error:", queryError);
      return NextResponse.json(
        { error: "Database query error", details: queryError.message },
        { status: 500 }
      );
    }
    
    // Handle case where no trips are found
    if (rows.length === 0) {
      await db.end();
      return NextResponse.json([]);
    }
    
    // Group the trips by instance_id AND booking_date (separate bookings made on different dates)
    const trips = {};
    rows.forEach(row => {
      // Create a composite key using both instance_id and booking date (YYYY-MM-DD)
      const bookingDate = new Date(row.booking_date).toISOString().split('T')[0];
      const tripKey = `${row.instance_id}_${bookingDate}`;
      
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

    await db.end();
    return NextResponse.json(Object.values(trips));
    
  } catch (error) {
    console.error("API route error:", error);
    if (db) {
      try {
        await db.end();
      } catch (closeError) {
        console.error("Error closing DB connection:", closeError);
      }
    }
    
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
