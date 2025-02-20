SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE flights DROP FOREIGN KEY flights_ibfk_1;
ALTER TABLE flights DROP FOREIGN KEY flights_ibfk_2;


-- Modify flight_no to be an integer without auto-increment
ALTER TABLE flights MODIFY flight_no INT NOT NULL;

-- Drop unnecessary columns
ALTER TABLE flights 
    DROP COLUMN departure_time,
    DROP COLUMN arrival_time,
    DROP COLUMN departure_airport_id,
    DROP COLUMN arrival_airport_id;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE FlightSchedule (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    flight_no INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    departure_airport_id VARCHAR(3) NOT NULL,
    arrival_airport_id VARCHAR(3) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_no) REFERENCES Flights(flight_no),
    FOREIGN KEY (departure_airport_id) REFERENCES Airports(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES Airports(airport_id)
);
