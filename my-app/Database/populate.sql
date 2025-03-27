INSERT INTO airlines VALUES 
('Air India'), 
('AirAsia'), 
('IndiGo'), 
('SpiceJet'), 
('Vistara'),
('GoAir');


INSERT INTO flights (flight_no, airline_name) VALUES
(101, 'Air India'),
(102, 'IndiGo'),
(103, 'SpiceJet'),
(104, 'Vistara'),
(105, 'GoAir'),
(106, 'AirAsia');

INSERT INTO airports (airport_id, name, location) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai'),
('BLR', 'Kempegowda International Airport', 'Bengaluru'),
('MAA', 'Chennai International Airport', 'Chennai'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata');

INSERT INTO flight_routes (departure_airport_id, arrival_airport_id) VALUES
('DEL', 'BOM'), -- Delhi to Mumbai
('DEL', 'BLR'), -- Delhi to Bangalore
('BOM', 'MAA'), -- Mumbai to Chennai
('BLR', 'HYD'), -- Bangalore to Hyderabad
('MAA', 'CCU'), -- Chennai to Kolkata
('HYD', 'DEL'), -- Hyderabad to Delhi
('CCU', 'BOM'); -- Kolkata to Mumbai

INSERT INTO flight_instances (flight_no, airline_name, route_id, departure_time, arrival_time, price) VALUES
(101, 'Air India', 1, '2025-04-01 06:00:00', '2025-04-01 08:15:00', 5500.00),
(102, 'IndiGo', 2, '2025-04-01 09:30:00', '2025-04-01 12:00:00', 4700.00),
(103, 'SpiceJet', 3, '2025-04-01 14:00:00', '2025-04-01 16:30:00', 5000.00),
(104, 'Vistara', 4, '2025-04-01 17:45:00', '2025-04-01 19:15:00', 4600.00),
(106, 'AirAsia', 5, '2025-04-02 07:00:00', '2025-04-02 09:30:00', 5200.00),
(101, 'Air India', 6, '2025-04-02 11:00:00', '2025-04-02 13:30:00', 5800.00),
(102, 'IndiGo', 7, '2025-04-02 18:00:00', '2025-04-02 20:15:00', 5300.00);
