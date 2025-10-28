-- PostgreSQL / Supabase compatible schema for Flight Booking System
-- Run this in the Supabase SQL editor (SQL > New query) or via psql using the project's DATABASE_URL

-- airports
CREATE TABLE IF NOT EXISTS airports (
  airport_id VARCHAR(3) PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  CONSTRAINT airport_id_chk CHECK (airport_id ~ '^[A-Z]{3}$')
);

-- airlines
CREATE TABLE IF NOT EXISTS airlines (
  airline_name VARCHAR(255) PRIMARY KEY
);

-- flights (composite primary key: flight_no + airline_name)
CREATE TABLE IF NOT EXISTS flights (
  flight_no INTEGER NOT NULL,
  airline_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (flight_no, airline_name),
  FOREIGN KEY (airline_name) REFERENCES airlines(airline_name) ON DELETE CASCADE
);

-- flight routes
CREATE TABLE IF NOT EXISTS flight_routes (
  route_id BIGSERIAL PRIMARY KEY,
  departure_airport_id VARCHAR(3) NOT NULL,
  arrival_airport_id VARCHAR(3) NOT NULL,
  FOREIGN KEY (departure_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE,
  FOREIGN KEY (arrival_airport_id) REFERENCES airports(airport_id) ON DELETE CASCADE
);

-- flight instances
CREATE TABLE IF NOT EXISTS flight_instances (
  instance_id BIGSERIAL PRIMARY KEY,
  flight_no INTEGER NOT NULL,
  airline_name VARCHAR(255) NOT NULL,
  route_id BIGINT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (flight_no, airline_name) REFERENCES flights(flight_no, airline_name) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES flight_routes(route_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_flight_instances_flight ON flight_instances(flight_no, airline_name);

-- users
CREATE TABLE IF NOT EXISTS users (
  user_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_no VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- tickets
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id BIGSERIAL PRIMARY KEY,
  seat_number VARCHAR(10) NOT NULL,
  user_id BIGINT NOT NULL,
  instance_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (instance_id) REFERENCES flight_instances(instance_id) ON DELETE CASCADE
);

-- admin
CREATE TABLE IF NOT EXISTS admin (
  admin_id BIGSERIAL PRIMARY KEY,
  admin_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_no VARCHAR(40) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL,
  airline_name VARCHAR(255) NOT NULL,
  FOREIGN KEY (airline_name) REFERENCES airlines(airline_name) ON DELETE CASCADE
);

-- Optional: insert some example airlines/airports (uncomment to seed)
-- INSERT INTO airlines (airline_name) VALUES ('Air India'), ('Indigo'), ('SpiceJet');
-- INSERT INTO airports (airport_id, location) VALUES ('DEL', 'Delhi'), ('BLR', 'Bengaluru'), ('BOM', 'Mumbai');
