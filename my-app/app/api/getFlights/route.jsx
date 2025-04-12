import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(request) {
  // Use request.nextUrl in Next.js 13 for search params
  const airline = request.nextUrl?.searchParams?.get('airline') || ''; // admin's airline name

  try {
    let sql = "SELECT flight_no, airline_name, max_seat FROM flights";
    let params = [];

    // Filter if airline is provided
    if (airline) {
      sql += " WHERE airline_name = ?";
      params.push(airline);
    }

    const [rows] = await db.execute(sql, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
