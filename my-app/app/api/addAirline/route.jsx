import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request) {
  let connection;
  try {
    const { airlineName } = await request.json();

    if (!airlineName) {
      return NextResponse.json(
        { error: "Airline name is required" },
        { status: 400 }
      );
    }

    await pool.query("INSERT INTO airlines (airline_name) VALUES ($1)", [airlineName]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
