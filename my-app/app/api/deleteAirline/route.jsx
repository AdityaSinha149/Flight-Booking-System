import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(request) {
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
    
    // Delete the airline without checking for admins or flights
    const query = `DELETE FROM airlines WHERE airline_name = ?`;
    const [result] = await connection.execute(query, [airlineName]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Airline not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
