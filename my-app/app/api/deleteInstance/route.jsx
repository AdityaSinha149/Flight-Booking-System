import { NextResponse } from 'next/server';
import mysql from "mysql2/promise";

export async function DELETE(request) {
  const instanceId = request.nextUrl?.searchParams?.get("instanceId");
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });
    await connection.execute("DELETE FROM flight_instances WHERE instance_id = ?", [instanceId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}