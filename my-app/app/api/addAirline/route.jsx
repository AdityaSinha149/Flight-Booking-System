import { NextResponse } from "next/server";
import db from "@/lib/db";

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

    connection = await db.getConnection();
    const query = `INSERT INTO airlines (airline_name) VALUES (?)`;
    await connection.execute(query, [airlineName]);

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (connection) connection.release();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
