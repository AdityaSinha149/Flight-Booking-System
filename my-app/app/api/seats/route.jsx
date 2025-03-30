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
        const { instance_id } = await request.json();
        
        if (!instance_id) {
            return NextResponse.json(
                { error: "Missing instance_id" },
                { status: 400 }
            );
        }
        
        db = await mysql.createConnection(dbConfig);
        
        const [rows] = await db.execute(`
            SELECT t.seat_number
            FROM tickets t
            WHERE t.instance_id = ?;
        `, [instance_id]);

        await db.end();
        
        const seatNumbers = rows.map(row => row.seat_number.toString());
        
        return NextResponse.json(seatNumbers, { status: 200 });
    } catch (error) {
        if (db) await db.end();
        return NextResponse.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
