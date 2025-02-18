# Relational Schema
**primary_key**, attribute, _foreign_key_

## Users
**user_id**, name, password, email, phone_no  

## Airports
**airport_id**, name, location  

## Flights
**flight_no**, airline, departure_time, arrival_time, _departure_airport_id_, _arrival_airport_id_  

## Tickets
**ticket_no**, ticket_type  

## Payments
**payment_id**, payment_method, transaction_time, transaction_cost, payment_status, _user_id_  

# Relationships

## Books (User → Flight)
**_user_id_**, **_flight_no_**  

## Buys (User → Ticket)
**_user_id_**, **_ticket_no_**  

## IssuedFor (Ticket → Flight)
**_ticket_no_**, **_flight_no_**  

## Pays (User → Payment)
**_user_id_**, **_payment_id_**  
