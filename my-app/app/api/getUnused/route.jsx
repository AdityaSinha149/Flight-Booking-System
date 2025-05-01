import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request) {
    try {
        const { rows: unusedAirlines } = await pool.query(`
            SELECT a.airline_name
            FROM airlines a
            LEFT JOIN flights f ON a.airline_name = f.airline_name
            WHERE f.flight_no IS NULL
        `);

        const { rows: unusedAirports } = await pool.query(`
            SELECT a.airport_id, a.location
            FROM airports a
            WHERE a.airport_id NOT IN (
                SELECT DISTINCT r.departure_airport_id FROM flight_routes r
                UNION
                SELECT DISTINCT r.arrival_airport_id FROM flight_routes r
            )
        `);

        const { rows: unusedRoutes } = await pool.query(`
            SELECT r.route_id,
                r.departure_airport_id,
                da.location AS departure_location,
                r.arrival_airport_id,
                aa.location AS arrival_location
            FROM flight_routes r
            LEFT JOIN airports da ON r.departure_airport_id = da.airport_id
            LEFT JOIN airports aa ON r.arrival_airport_id = aa.airport_id
            WHERE r.route_id NOT IN (
                SELECT DISTINCT f.route_id FROM flight_instances f
            )
        `);

        return NextResponse.json({
            airlines: unusedAirlines,
            airports: unusedAirports,
            routes: unusedRoutes
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message, details: error.message },
            { status: 500 }
        );
    }
}
