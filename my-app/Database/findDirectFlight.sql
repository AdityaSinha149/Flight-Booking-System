DELIMITER //

CREATE PROCEDURE FindDirectFlights(
    IN start_airport VARCHAR(3),
    IN end_airport VARCHAR(3),
    IN start_date DATETIME,
    IN seats_needed INT,
    IN sort_by VARCHAR(50),
    IN sort_order VARCHAR(4)
)
BEGIN
    SET @sort_field = IFNULL(sort_by, 'departure_time');
    SET @sort_direction = CASE 
        WHEN LOWER(sort_order) = 'desc' THEN 'DESC'
        ELSE 'ASC'
    END;

    SET @sql = CONCAT('
    SELECT 
        fi.flight_no AS flight_no,
        fi.airline_name AS airline,
        fr.departure_airport_id AS departure_airport,
        fr.arrival_airport_id AS arrival_airport,
        TIME_FORMAT(TIMEDIFF(fi.arrival_time, fi.departure_time), ''%H:%i:%s'') AS duration,
        fi.departure_time AS departure_datetime,
        DATE_FORMAT(fi.departure_time, ''%h:%i %p'') AS departure,
        fi.arrival_time AS arrival_datetime,
        DATE_FORMAT(fi.arrival_time, ''%h:%i %p'') AS arrival,
        start_airport AS layover_chain,
        ''Direct'' AS stops,
        ''Direct'' AS layover_text,
        FORMAT(fi.price, 2) AS price
    FROM flight_instances fi
    NATURAL JOIN flight_routes fr
    NATURAL JOIN flights f
    LEFT JOIN (
        SELECT instance_id, COUNT(*) AS seat_count
        FROM tickets
        GROUP BY instance_id
    ) booked ON fi.instance_id = booked.instance_id
    WHERE fr.departure_airport_id = ''', start_airport, '''
      AND fr.arrival_airport_id = ''', end_airport, '''
      AND DATE(fi.departure_time) = DATE(''', start_date, ''')
      AND (f.max_seat - IFNULL(booked.seat_count, 0)) >= ', seats_needed, '
    ORDER BY ', @sort_field, ' ', @sort_direction);

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;
