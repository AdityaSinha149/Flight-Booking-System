DELIMITER //

CREATE PROCEDURE FindDirectFlights(
    IN start_airport VARCHAR(3),
    IN end_airport VARCHAR(3),
    IN start_date DATETIME
)
BEGIN
    SELECT 
        f.airline AS airline,
        fs.departure_airport_id AS departure_airport,
        fs.arrival_airport_id AS arrival_airport,
        TIME_FORMAT(TIMEDIFF(fs.arrival_time, fs.departure_time), '%H:%i:%s') AS duration,
        DATE_FORMAT(fs.departure_time, '%h:%i%p') AS departure,
        DATE_FORMAT(fs.arrival_time, '%h:%i%p') AS arrival,
        start_airport AS layover_chain,
        'Direct' AS stops,
        'Direct' AS layover_text,
        FORMAT(fs.price, 2) AS price
    FROM FLIGHTSCHEDULE fs
    JOIN FLIGHTS f ON fs.flight_no = f.flight_no
    WHERE fs.departure_airport_id = start_airport
      AND fs.arrival_airport_id = end_airport
      AND fs.departure_time >= start_date
    ORDER BY fs.departure_time;
END //

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE GETCONNECTINGFLIGHTS(
    IN start_airport VARCHAR(3),
    IN end_airport VARCHAR(3),
    IN travel_date DATE
)
BEGIN
    -- Temporary table to store intermediate results
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_flights (
        flight_no INT,
        airline VARCHAR(255),
        departure_time DATETIME,
        arrival_time DATETIME,
        departure_airport_id VARCHAR(3),
        arrival_airport_id VARCHAR(3),
        price DECIMAL(10, 2)
    );

    -- Insert direct flights into temp_flights
    INSERT INTO temp_flights (flight_no, airline, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
    SELECT 
        fs.flight_no,
        f.airline,
        fs.departure_time,
        fs.arrival_time,
        fs.departure_airport_id,
        fs.arrival_airport_id,
        fs.price
    FROM flights f
    JOIN flightschedule fs ON f.flight_no = fs.flight_no
    WHERE fs.departure_airport_id = start_airport
      AND fs.arrival_airport_id = end_airport
      AND DATE(fs.departure_time) = travel_date;

    -- Recursive query to get connecting flights (up to 2 stops)
    WITH RECURSIVE connecting_flights AS (
        -- Base case: direct flights
        SELECT
            fs1.flight_no AS first_leg_flight_no,
            f1.airline AS first_leg_airline,
            fs1.departure_time AS first_leg_departure_time,
            fs1.arrival_time AS first_leg_arrival_time,
            fs1.departure_airport_id AS first_leg_departure_airport_id,
            fs1.arrival_airport_id AS first_leg_arrival_airport_id,
            fs1.price AS first_leg_price,
            fs1.arrival_airport_id AS intermediate_airport_id,
            1 AS num_stops
        FROM flights f1
        JOIN flightschedule fs1 ON f1.flight_no = fs1.flight_no
        WHERE fs1.departure_airport_id = start_airport
          AND DATE(fs1.departure_time) = travel_date

        UNION ALL

        -- Recursive case: connecting flights (1 stop)
        SELECT
            fs2.flight_no AS first_leg_flight_no,
            f2.airline AS first_leg_airline,
            fs2.departure_time AS first_leg_departure_time,
            fs2.arrival_time AS first_leg_arrival_time,
            fs2.departure_airport_id AS first_leg_departure_airport_id,
            fs2.arrival_airport_id AS first_leg_arrival_airport_id,
            fs2.price AS first_leg_price,
            fs2.arrival_airport_id AS intermediate_airport_id,
            cf.num_stops + 1 AS num_stops
        FROM flights f2
        JOIN flightschedule fs2 ON f2.flight_no = fs2.flight_no
        JOIN connecting_flights cf ON fs2.departure_airport_id = cf.intermediate_airport_id
        WHERE cf.num_stops <= 2  -- Limit to 2 stops
    )

    -- Fetch connecting flights from the recursive query and format output
    SELECT
        cf.first_leg_airline AS airline,
        TIMEDIFF(cf.first_leg_arrival_time, cf.first_leg_departure_time) AS duration,
        DATE_FORMAT(cf.first_leg_departure_time, '%h:%i%p') AS departure,
        DATE_FORMAT(cf.first_leg_arrival_time, '%h:%i%p') AS arrival,
        CASE 
            WHEN cf.num_stops = 0 THEN 'Direct'
            ELSE CONCAT(cf.num_stops, ' stop')
        END AS stops,
        CASE 
            WHEN cf.num_stops = 0 THEN 'No layover'
            ELSE CONCAT('Layover at ', cf.intermediate_airport_id)
        END AS layover,
        cf.first_leg_price AS price
    FROM connecting_flights cf;

    -- Drop the temporary table after the procedure completes
    DROP TEMPORARY TABLE IF EXISTS temp_flights;

END $$

DELIMITER ;
