import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function GET(request) {
  // Use request.nextUrl in Next.js 13 for search params
  const airline = request.nextUrl?.searchParams?.get('airline') || ''; // admin's airline name

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });

    let query = "SELECT flight_no, airline_name, max_seat FROM flights";
    let params = [];

    // Filter if airline is provided
    if (airline) {
      query += " WHERE airline_name = ?";
      params.push(airline);
    }

    const [rows] = await connection.execute(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
