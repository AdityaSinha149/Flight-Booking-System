CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Airports (
    airport_id VARCHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE Flights (
    flight_no INT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    departure_airport_id VARCHAR(3),
    arrival_airport_id VARCHAR(3),
    FOREIGN KEY (departure_airport_id) REFERENCES Airports(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES Airports(airport_id)
);

CREATE TABLE Tickets (
    ticket_no INT PRIMARY KEY AUTO_INCREMENT,
    ticket_type VARCHAR(50) NOT NULL
);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_method VARCHAR(50) NOT NULL,
    transaction_time DATETIME NOT NULL,
    transaction_cost DECIMAL(10,2) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Books (
    user_id INT,
    flight_no INT,
    PRIMARY KEY (user_id, flight_no),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (flight_no) REFERENCES Flights(flight_no)
);

CREATE TABLE Buys (
    user_id INT,
    ticket_no INT,
    PRIMARY KEY (user_id, ticket_no),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (ticket_no) REFERENCES Tickets(ticket_no)
);

CREATE TABLE IssuedFor (
    ticket_no INT,
    flight_no INT,
    PRIMARY KEY (ticket_no, flight_no),
    FOREIGN KEY (ticket_no) REFERENCES Tickets(ticket_no),
    FOREIGN KEY (flight_no) REFERENCES Flights(flight_no)
);

CREATE TABLE Pays (
    user_id INT,
    payment_id INT,
    PRIMARY KEY (user_id, payment_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id)
);



