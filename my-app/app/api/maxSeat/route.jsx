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
            SELECT f.max_seat
            FROM flight_instances fi
            JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
            WHERE fi.instance_id = ?
        `, [instance_id]);
        
        let maxSeat = 0;
        if (rows && rows.length > 0) {
            maxSeat = rows[0].max_seat
        }

        await db.end();
        
        return NextResponse.json({ maxSeat: Number(maxSeat) }, { status: 200 });
    } catch (error) {
        if (db) await db.end();
        return NextResponse.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
