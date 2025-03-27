CREATE TABLE log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    flight_no INT NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    departure_airport VARCHAR(3) NOT NULL,
    arrival_airport VARCHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER //

CREATE TRIGGER after_ticket_insert
AFTER INSERT ON tickets
FOR EACH ROW
BEGIN
    DECLARE v_user_name VARCHAR(255);
    DECLARE v_email VARCHAR(255);
    DECLARE v_phone_no VARCHAR(20);
    DECLARE v_flight_no INT;
    DECLARE v_airline_name VARCHAR(255);
    DECLARE v_departure_airport VARCHAR(3);
    DECLARE v_arrival_airport VARCHAR(3);
    DECLARE v_departure_time DATETIME;
    DECLARE v_arrival_time DATETIME;
    DECLARE v_price DECIMAL(10,2);

    -- Get user details
    SELECT name, email, phone_no INTO v_user_name, v_email, v_phone_no
    FROM users WHERE user_id = NEW.user_id;

    -- Get flight details
    SELECT fi.flight_no, f.airline_name, fr.departure_airport_id, fr.arrival_airport_id, 
           fi.departure_time, fi.arrival_time, fi.price
    INTO v_flight_no, v_airline_name, v_departure_airport, v_arrival_airport, 
         v_departure_time, v_arrival_time, v_price
    FROM flight_instances fi
    JOIN flights f ON fi.flight_no = f.flight_no AND fi.airline_name = f.airline_name
    JOIN flight_routes fr ON fi.route_id = fr.route_id
    WHERE fi.instance_id = NEW.instance_id;

    -- Insert into log table
    INSERT INTO log (user_name, email, phone_no, flight_no, airline_name, 
                     departure_airport, arrival_airport, departure_time, arrival_time, 
                     seat_number, price)
    VALUES (v_user_name, v_email, v_phone_no, v_flight_no, v_airline_name, 
            v_departure_airport, v_arrival_airport, v_departure_time, v_arrival_time, 
            NEW.seat_number, v_price);
END;

//

DELIMITER ;
