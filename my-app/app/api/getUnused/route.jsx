import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
};

export async function GET(request) {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);

        // Query to find unused airlines (airlines with no flights)
        const unusedAirlinesQuery = `
            SELECT a.airline_name 
            FROM airlines a
            LEFT JOIN flights f ON a.airline_name = f.airline_name
            WHERE f.flight_no IS NULL
        `;

        // Complex query to find unused airports - updated for new table structure
        const unusedAirportsQuery = `
            select a.airport_id, a.location
            from airports a
            where a.airport_id not in (
              select distinct r.departure_airport_id 
              from flight_routes r
              union
              select distinct r.arrival_airport_id 
              from flight_routes r
            )
        `;

        // Query to find unused routes - updated for new table structure
        const unusedRoutesQuery = `
            SELECT r.route_id, 
                r.departure_airport_id, 
                da.location AS departure_location, 
                r.arrival_airport_id, 
                aa.location AS arrival_location
            FROM flight_routes r
                LEFT JOIN airports da ON r.departure_airport_id = da.airport_id
                LEFT JOIN airports aa ON r.arrival_airport_id = aa.airport_id
            WHERE r.route_id NOT IN (
                SELECT DISTINCT f.route_id 
                FROM flight_instances f
            )
        `;

        // Execute all queries
        const [unusedAirlines] = await db.query(unusedAirlinesQuery);
        const [unusedAirports] = await db.query(unusedAirportsQuery);
        const [unusedRoutes] = await db.query(unusedRoutesQuery);

        await db.end();
        return NextResponse.json({
            airlines: unusedAirlines,
            airports: unusedAirports,
            routes: unusedRoutes
        });
    } catch (error) {
        if (db) await db.end();
        return NextResponse.json(
            { error: error.message, details: error.message },
            { status: 500 }
        );
    }
}
