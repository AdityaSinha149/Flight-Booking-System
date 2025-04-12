import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
    try {
        const { instance_id } = await request.json();
        
        if (!instance_id) {
            return NextResponse.json(
                { error: "Missing instance_id" },
                { status: 400 }
            );
        }
        
        // Replace query function with direct DB execute
        const [rows] = await db.execute(`
            SELECT f.max_seat
            FROM flight_instances fi
            JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
            WHERE fi.instance_id = ?
        `, [instance_id]);
        
        let maxSeat = 0;
        if (rows && rows.length > 0) {
            maxSeat = rows[0].max_seat;
        }
        
        return NextResponse.json({ maxSeat: Number(maxSeat) }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
