# Relational Schema
**primary_key**, attribute, _foreign_key_

## Users
**user_id**, name, password, email, phone_no, dob, address  

## Airports
**airport_id**, name, location  

## Flights
**flight_no**, airline, departure_time, arrival_time, _departure_airport_id_, _arrival_airport_id_, max_seats

## Tickets
**ticket_no**, ticket_type, seat_number, _user_id_ , name, email,phone_no, flight_no
