import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

export async function GET() {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);
    const query = `SELECT airline_name FROM airlines ORDER BY airline_name`;
    const [rows] = await db.execute(query);
    await db.end();
    return NextResponse.json(rows);
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
