import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(req) {
  let connection;
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "sinha",
      database: "airline_booking",
    });

    console.log("Connected to DB successfully");

    let query = "SELECT user_id, name, email, phone_no, password FROM users WHERE ";
    let queryParams = [];

    if (username.includes('@')) {
      query += "email = ?";
    } else {
        query += "phone_no = ?";
    }
    queryParams = [username];

    const [user] = await connection.execute(query, queryParams);
    
    if (!user.length) {
      connection.end();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      connection.end();
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    connection.end();
    return NextResponse.json({ 
      message: "Sign-in successful!", 
      userId: user[0].user_id,
      name: user[0].name,
      email: user[0].email,
      phone_no: user[0].phone_no
    }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) await connection.end();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
