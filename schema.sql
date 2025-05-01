-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_no VARCHAR(15) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Airlines
CREATE TABLE IF NOT EXISTS airlines (
  airline_name VARCHAR(100) PRIMARY KEY
);

-- Airports
CREATE TABLE IF NOT EXISTS airports (
  airport_id VARCHAR(10) PRIMARY KEY,
  location VARCHAR(100) NOT NULL
);

-- Flight routes
CREATE TABLE IF NOT EXISTS flight_routes (
  route_id SERIAL PRIMARY KEY,
  departure_airport_id VARCHAR(10) REFERENCES airports(airport_id),
  arrival_airport_id VARCHAR(10) REFERENCES airports(airport_id)
);

-- Flights
CREATE TABLE IF NOT EXISTS flights (
  flight_no VARCHAR(20) NOT NULL,
  airline_name VARCHAR(100) REFERENCES airlines(airline_name),
  max_seat INT NOT NULL,
  PRIMARY KEY (flight_no, airline_name)
);

-- Flight instances
CREATE TABLE IF NOT EXISTS flight_instances (
  instance_id SERIAL PRIMARY KEY,
  route_id INT REFERENCES flight_routes(route_id),
  flight_no VARCHAR(20),
  airline_name VARCHAR(100),
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (flight_no, airline_name) REFERENCES flights(flight_no, airline_name)
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id SERIAL PRIMARY KEY,
  instance_id INT REFERENCES flight_instances(instance_id),
  seat_number VARCHAR(10),
  user_id INT REFERENCES users(user_id)
);

-- Admin
CREATE TABLE IF NOT EXISTS admin (
  admin_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_no VARCHAR(15) UNIQUE NOT NULL,
  pass TEXT NOT NULL,
  airline_name VARCHAR(100) REFERENCES airlines(airline_name)
);
