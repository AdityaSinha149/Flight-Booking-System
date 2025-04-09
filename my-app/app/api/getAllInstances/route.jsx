import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function GET(request) {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);
    
    // Query to get all flight instances with route details
    const query = `
      SELECT fi.*, f.airline_name, r.departure_airport_id, r.arrival_airport_id
      FROM flight_instances fi
      JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
      JOIN flight_routes r ON fi.route_id = r.route_id
      ORDER BY fi.departure_time DESC
    `;
    
    const [instances] = await db.query(query);
    
    await db.end();
    return NextResponse.json(instances);
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
