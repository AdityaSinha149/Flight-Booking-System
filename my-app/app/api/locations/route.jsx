import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });

    const [locations] = await connection.execute("SELECT airport_id, location FROM airports");
    connection.end();

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    if (connection) await connection.end();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
