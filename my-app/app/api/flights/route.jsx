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
  
      console.log("Connecting to DB...");
      db = await mysql.createConnection(dbConfig);
      console.log("Connected successfully!");
  
      console.log(`Executing stored procedure with params:`, start_airport, end_airport, travel_date);
      const [rows] = await db.execute("CALL GETCONNECTINGFLIGHTS(?, ?, ?)", [
        start_airport,
        end_airport,
        travel_date,
      ]);
  
      console.log("Query executed successfully!");
      await db.end();
      console.log(rows[0]);  // Check the structure of the flights array

      return NextResponse.json(rows[0]);
    } catch (error) {
      console.error("Database Error:", error);
      if (db) await db.end();
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }
  }
  