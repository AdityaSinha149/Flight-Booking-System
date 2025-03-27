1️⃣ airports Table 

CREATE TABLE airports (
    airport_id VARCHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);
2️⃣ airlines Table 

CREATE TABLE airlines (
    airline_name VARCHAR(255) PRIMARY KEY
);
3️⃣ flights Table 

CREATE TABLE flights (
    flight_no INT NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (flight_no, airline_name),
    FOREIGN KEY (airline_name) REFERENCES airlines(airline_name) ON DELETE CASCADE
);
4️⃣ flight_routes Table 

CREATE TABLE flight_routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    departure_airport_id VARCHAR(3) NOT NULL,
    arrival_airport_id VARCHAR(3) NOT NULL,
    FOREIGN KEY (departure_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE,
    FOREIGN KEY (arrival_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE
);
5️⃣ flight_instances Table 

CREATE TABLE flight_instances (
    instance_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_no INT NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    route_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (flight_no, airline_name) REFERENCES flights(flight_no, airline_name) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES flight_routes(route_id) ON DELETE CASCADE
);
6️⃣ users Table 

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_no VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
7️⃣ tickets Table 

CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    seat_number VARCHAR(10) NOT NULL,
    user_id INT NOT NULL,
    instance_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (instance_id) REFERENCES flight_instances(instance_id) ON DELETE CASCADE
);