import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    let query = `
      SELECT user_id AS "userId",
             first_name || ' ' || last_name AS "name",
             email,
             phone_no,
             password
      FROM users
      WHERE `;
    let queryParams = [];

    if (username.includes('@')) {
      query += "email = $1";
      queryParams = [username];
    } else {
      query += "phone_no = $1";
      queryParams = [username];
    }

    const { rows } = await pool.query(query, queryParams);

    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Sign-in successful!",
      userId: rows[0].userId,
      name: rows[0].name,
      email: rows[0].email,
      phone_no: rows[0].phone_no
    }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}
