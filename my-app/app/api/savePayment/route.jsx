import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  let connection;
  try {
    const { ticket_ids, user_id, amount_paid, payment_method, transaction_id } = await req.json();
    
    // Validate payment method
    const validPaymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash'];
    if (!validPaymentMethods.includes(payment_method)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!ticket_ids || !Array.isArray(ticket_ids) || !user_id || !amount_paid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });
    
    // Start transaction
    await connection.beginTransaction();
    
    // Insert payment records for all tickets
    for (const ticket_id of ticket_ids) {
      await connection.execute(
        "INSERT INTO payments (ticket_id, user_id, amount_paid, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?)",
        [ticket_id, user_id, amount_paid, payment_method, transaction_id]
      );
    }
    
    // Commit the transaction
    await connection.commit();
    
    await connection.end();
    return NextResponse.json({ 
      success: true, 
      message: "Payment saved successfully" 
    });
    
  } catch (error) {
    console.error("Database Error:", error);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback Error:", rollbackError);
      }
      await connection.end();
    }
    return NextResponse.json(
      { error: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
