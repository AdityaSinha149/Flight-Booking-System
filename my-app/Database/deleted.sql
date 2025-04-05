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

DELIMITER $$

CREATE TRIGGER before_ticket_delete
BEFORE DELETE ON tickets
FOR EACH ROW
BEGIN
    INSERT INTO deleted_tickets (ticket_id, seat_number, user_id, instance_id, name, email, phone_no, booking_time, deleted_at)
    VALUES (OLD.ticket_id, OLD.seat_number, OLD.user_id, OLD.instance_id, OLD.name, OLD.email, OLD.phone_no, OLD.booking_time, NOW());
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

DELIMITER $$

CREATE TRIGGER before_flight_instance_delete
BEFORE DELETE ON flight_instances
FOR EACH ROW
BEGIN
    INSERT INTO deleted_flight_instances (
        instance_id, flight_no, airline_name, route_id, 
        departure_time, arrival_time, price
    ) 
    VALUES (
        OLD.instance_id, OLD.flight_no, OLD.airline_name, OLD.route_id, 
        OLD.departure_time, OLD.arrival_time, OLD.price
    );
END $$

DELIMITER ;

