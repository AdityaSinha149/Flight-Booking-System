DELIMITER //

CREATE PROCEDURE FindDirectFlights(
    IN start_airport VARCHAR(3),
    IN end_airport VARCHAR(3),
    IN start_date DATETIME
)
BEGIN
    SELECT 
        fi.flight_no AS flight_no,
        fi.airline_name AS airline,
        fr.departure_airport_id AS departure_airport,
        fr.arrival_airport_id AS arrival_airport,
        TIME_FORMAT(TIMEDIFF(fi.arrival_time, fi.departure_time), '%H:%i:%s') AS duration,
        DATE_FORMAT(fi.departure_time, '%h:%i %p') AS departure,
        DATE_FORMAT(fi.arrival_time, '%h:%i %p') AS arrival,
        start_airport AS layover_chain,
        'Direct' AS stops,
        'Direct' AS layover_text,
        FORMAT(fi.price, 2) AS price
    FROM flight_instances fi
    JOIN flight_routes fr ON fi.route_id = fr.route_id
    WHERE fr.departure_airport_id = start_airport
      AND fr.arrival_airport_id = end_airport
      AND DATE(fi.departure_time) = DATE(start_date)  -- Restricts to the same date
    ORDER BY fi.departure_time;
END //

DELIMITER ;
