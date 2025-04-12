import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export async function POST(req) {
  let connection;
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    connection = await db.getConnection();

    let query = `SELECT user_id AS userId, 
                    CONCAT(first_name, ' ', last_name) AS name,
                    email,
                    phone_no,
                    password 
             FROM users 
             WHERE `;
    let queryParams = [];

    if (username.includes('@')) {
      query += "email = ?";
      queryParams = [username];
    } else {
      query += "phone_no = ?";
      queryParams = [username];
    }

    const [user] = await connection.execute(query, queryParams);

    if (!user.length) {
      connection.release();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      connection.release();
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    connection.release();
    return NextResponse.json({
      message: "Sign-in successful!",
      userId: user[0].userId,
      name: user[0].name,
      email: user[0].email,
      phone_no: user[0].phone_no
    }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    if (connection) connection.release();
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
