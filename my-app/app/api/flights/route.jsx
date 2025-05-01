import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request) {
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
      
      // Simplified sort parameter validation
      const validSortFields = {
        'departure_datetime': 'fi.departure_time',
        'price': 'fi.price',
        'duration': 'TIMEDIFF(fi.arrival_time, fi.departure_time)',
        'airline': 'fi.airline_name'
      };
      
      const orderBy = validSortFields[sortBy] || validSortFields['departure_datetime'];
      const direction = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      
      const sql = `
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
          AND (f.max_seat - IFNULL(booked.seat_count, 0)) >= ?
        ORDER BY ${orderBy} ${direction}
      `;
      
      const { rows } = await pool.query(sql, [
        start_airport,
        end_airport,
        travel_date,
        seats_needed
      ]);

      return NextResponse.json(rows);
    } catch (error) {
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
  }
