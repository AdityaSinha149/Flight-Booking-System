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
            SELECT t.seat_number
            FROM tickets t
            WHERE t.instance_id = ?;
        `, [instance_id]);
        
        const seatNumbers = rows.map(row => row.seat_number.toString());
        
        return NextResponse.json(seatNumbers, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Database error", details: error.message },
            { status: 500 }
        );
    }
}
