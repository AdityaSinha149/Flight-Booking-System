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
    const { airlineName } = await request.json();

    if (!airlineName) {
      return NextResponse.json(
        { error: "Airline name is required" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);
    const query = `INSERT INTO airlines (airline_name) VALUES (?)`;
    await db.execute(query, [airlineName]);

    await db.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
