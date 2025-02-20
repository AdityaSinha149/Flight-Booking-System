INSERT INTO airports (airport_id, name, location) VALUES
('AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad'),
('BLR', 'Kempegowda International Airport', 'Bengaluru'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata'),
('COK', 'Cochin International Airport', 'Kochi'),
('DEL', 'Indira Gandhi International Airport', 'New Delhi'),
('GOI', 'Manohar International Airport', 'Goa'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad'),
('MAA', 'Chennai International Airport', 'Chennai'),
('PNQ', 'Pune International Airport', 'Pune');

INSERT INTO flights (flight_no, airline) VALUES
(101, 'Air India'),
(102, 'IndiGo'),
(103, 'SpiceJet'),
(104, 'Vistara'),
(105, 'GoAir'),
(106, 'AirAsia');

INSERT INTO flightschedule (flight_no, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
VALUES 
(101, '2025-02-20 06:00:00', '2025-02-20 08:00:00', 'DEL', 'BOM', 5000.00);

INSERT INTO flightschedule (flight_no, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
VALUES 
(102, '2025-02-20 07:00:00', '2025-02-20 09:00:00', 'DEL', 'HYD', 4500.00),
(102, '2025-02-20 09:30:00', '2025-02-20 11:30:00', 'HYD', 'BOM', 4000.00);


INSERT INTO flightschedule (flight_no, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
VALUES 
(103, '2025-02-20 06:00:00', '2025-02-20 08:00:00', 'DEL', 'BLR', 4200.00),
(103, '2025-02-20 08:30:00', '2025-02-20 10:30:00', 'BLR', 'HYD', 3500.00),
(103, '2025-02-20 11:00:00', '2025-02-20 13:00:00', 'HYD', 'BOM', 3200.00);


INSERT INTO flightschedule (flight_no, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
VALUES 
(104, '2025-02-20 06:00:00', '2025-02-20 07:30:00', 'DEL', 'CCU', 4000.00),
(104, '2025-02-20 08:00:00', '2025-02-20 09:30:00', 'CCU', 'BLR', 3700.00),
(104, '2025-02-20 10:00:00', '2025-02-20 11:30:00', 'BLR', 'HYD', 3300.00),
(104, '2025-02-20 12:00:00', '2025-02-20 14:00:00', 'HYD', 'BOM', 3100.00);


INSERT INTO flightschedule (flight_no, departure_time, arrival_time, departure_airport_id, arrival_airport_id, price)
VALUES 
(105, '2025-02-20 05:00:00', '2025-02-20 06:30:00', 'DEL', 'PNQ', 3900.00),
(105, '2025-02-20 07:00:00', '2025-02-20 08:30:00', 'PNQ', 'CCU', 3600.00),
(105, '2025-02-20 09:00:00', '2025-02-20 10:30:00', 'CCU', 'BLR', 3400.00),
(105, '2025-02-20 11:00:00', '2025-02-20 12:30:00', 'BLR', 'HYD', 3200.00),
(105, '2025-02-20 13:00:00', '2025-02-20 15:00:00', 'HYD', 'BOM', 3000.00);


