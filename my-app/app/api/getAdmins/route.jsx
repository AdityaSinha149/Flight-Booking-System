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
    const { searchParams } = new URL(request.url);
    const airline = searchParams.get("airline");

    if (!airline) {
      return NextResponse.json(
        { error: "Missing airline parameter" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection(dbConfig);
    const query = `
      SELECT 
        admin_id, 
        CONCAT(first_name, ' ', last_name) AS admin_name, 
        email, 
        pass, 
        phone_no
      FROM admin
      WHERE airline_name = ?
    `;
    const [rows] = await db.execute(query, [airline]);

    await db.end();
    return NextResponse.json(rows);
  } catch (error) {
    if (db) await db.end();
    return NextResponse.json(
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}
