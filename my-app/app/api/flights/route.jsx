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
      const { 
        start_airport, 
        end_airport, 
        travel_date, 
        seats_needed,
        sortBy = 'departure_datetime', 
        sortOrder = 'asc'
      } = await request.json();
  
      if (!start_airport || !end_airport || !travel_date) {
        return NextResponse.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }
      
      // Validate sort parameters
      const validSortFields = ['departure_datetime', 'price', 'duration', 'airline'];
      const validSortOrders = ['asc', 'desc'];
      
      const actualSortField = validSortFields.includes(sortBy) ? sortBy : 'departure_datetime';
      const actualSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'asc';
      
      // Construct dynamic ORDER BY clause
      let orderBy = 'fi.departure_time'; // default
      
      if (actualSortField === 'departure_datetime') {
        orderBy = 'fi.departure_time';
      } else if (actualSortField === 'price') {
        orderBy = 'fi.price';
      } else if (actualSortField === 'duration') {
        orderBy = 'TIMEDIFF(fi.arrival_time, fi.departure_time)';
      } else if (actualSortField === 'airline') {
        orderBy = 'fi.airline_name';
      }
      
      const query = `
        SELECT 
          fi.instance_id AS instance_id,
          fi.flight_no AS flight_no,
          fi.airline_name AS airline,
          fr.departure_airport_id AS departure_airport,
          fr.arrival_airport_id AS arrival_airport,
          TIME_FORMAT(TIMEDIFF(fi.arrival_time, fi.departure_time), '%H:%i:%s') AS duration,
          fi.departure_time AS departure_datetime,
          DATE_FORMAT(fi.departure_time, '%h:%i %p') AS departure,
          fi.arrival_time AS arrival_datetime,
          DATE_FORMAT(fi.arrival_time, '%h:%i %p') AS arrival,
          ? AS layover_chain,
          'Direct' AS stops,
          'Direct' AS layover_text,
          FORMAT(fi.price, 2) AS price
        FROM flight_instances fi
        NATURAL JOIN flight_routes fr
        NATURAL JOIN flights f
        LEFT JOIN (
          SELECT instance_id, COUNT(*) AS seat_count
          FROM tickets
          GROUP BY instance_id
        ) booked ON fi.instance_id = booked.instance_id
        WHERE fr.departure_airport_id = ?
          AND fr.arrival_airport_id = ?
          AND DATE(fi.departure_time) = DATE(?)
          AND (f.maxSeat - IFNULL(booked.seat_count, 0)) >= ?
        ORDER BY ${orderBy} ${actualSortOrder === 'desc' ? 'DESC' : 'ASC'};
      `;
      
      db = await mysql.createConnection(dbConfig);
      const [rows] = await db.execute(query, [
        start_airport,
        start_airport,
        end_airport,
        travel_date,
        seats_needed
      ]);
  
      await db.end();

      return NextResponse.json(rows);
    } catch (error) {
      if (db) await db.end();
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
  }
