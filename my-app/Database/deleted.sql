CREATE TABLE deleted_tickets (
    ticket_id    INT PRIMARY KEY, 
    seat_number  VARCHAR(10) NOT NULL, 
    user_id      INT NOT NULL, 
    instance_id  INT NOT NULL, 
    name         VARCHAR(255) NOT NULL, 
    email        VARCHAR(255) NOT NULL, 
    phone_no     VARCHAR(20) NOT NULL, 
    booking_time TIMESTAMP,
    deleted_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS before_ticket_delete;

DELIMITER $$

CREATE TRIGGER before_ticket_delete
BEFORE DELETE ON tickets
FOR EACH ROW
BEGIN
    INSERT INTO deleted_tickets (
        ticket_id, seat_number, user_id, instance_id,
        name, email, phone_no, booking_time
    ) VALUES (
        OLD.ticket_id, OLD.seat_number, OLD.user_id, OLD.instance_id,
        CONCAT(OLD.first_name, ' ', OLD.last_name), OLD.email, OLD.phone_no, OLD.booking_time
    );
END$$

DELIMITER ;


CREATE TABLE deleted_flight_instances (
    instance_id INT PRIMARY KEY,
    flight_no INT NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    route_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS before_flight_instance_delete;

DELIMITER $$

CREATE TRIGGER before_flight_instance_delete
BEFORE DELETE ON flight_instances
FOR EACH ROW
BEGIN
    -- Backup associated tickets
    INSERT INTO deleted_tickets (
        ticket_id, seat_number, user_id, instance_id,
        name, email, phone_no, booking_time
    )
    SELECT
        ticket_id, seat_number, user_id, instance_id,
        CONCAT(first_name, ' ', last_name), email, phone_no, booking_time
    FROM tickets
    WHERE instance_id = OLD.instance_id;

    -- Backup the flight instance
    INSERT INTO deleted_flight_instances (
        instance_id, flight_no, airline_name, route_id,
        departure_time, arrival_time, price
    ) VALUES (
        OLD.instance_id, OLD.flight_no, OLD.airline_name, OLD.route_id,
        OLD.departure_time, OLD.arrival_time, OLD.price
    );
END$$

DELIMITER ;


CREATE TABLE deleted_flights (
    flight_no INT NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    max_seat INT NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TRIGGER IF EXISTS before_flight_delete;

DELIMITER $$

CREATE TRIGGER before_flight_delete
BEFORE DELETE ON flights
FOR EACH ROW
BEGIN
    INSERT INTO deleted_flights (
        flight_no, airline_name, max_seat
    ) VALUES (
        OLD.flight_no, OLD.airline_name, OLD.max_seat
    );
END$$

DELIMITER ;


CREATE TABLE deleted_airlines (
    airline_name VARCHAR(255) NOT NULL PRIMARY KEY,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS before_airline_delete;

DELIMITER $$

CREATE TRIGGER before_airline_delete
BEFORE DELETE ON airlines
FOR EACH ROW
BEGIN
    INSERT INTO deleted_airlines (
        airline_name
    ) VALUES (
        OLD.airline_name
    );
END$$

DELIMITER ;
