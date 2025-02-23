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
      const { start_airport, end_airport, travel_date } = await request.json();
  
      if (!start_airport || !end_airport || !travel_date) {
        return NextResponse.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }
      
      db = await mysql.createConnection(dbConfig);
      const [rows] = await db.execute("CALL FindDirectFlights(?, ?, ?)", [
        start_airport,
        end_airport,
        travel_date,
      ]);
  
      await db.end();

      return NextResponse.json(rows[0]);
    } catch (error) {
      if (db) await db.end();
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
  }
  