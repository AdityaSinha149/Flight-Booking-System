mysql> SELECT * FROM admin;
+----------+-----------------------+----------+--------------------------------------------------------------+--------------+------------+------------+
| admin_id | email                 | phone_no | pass                                                         | airline_name | first_name | last_name  |
+----------+-----------------------+----------+--------------------------------------------------------------+--------------+------------+------------+
|        1 | am@gmail.com          | 5657     | $2b$10$MLjC8Q1Win0mQXVguoquF.BwQLrVbST.m27Kh/u64WjBmREeQx4c2 | Air India    | Ainesh     | Mohan      |
|        2 | ss@gmail.com          | 890      | $2b$10$TJSYz0H78g.RVXnW57XsJerDDzJ.2a8atNp/rCAJ9ma6RLswHSujS | AirAsia      | Sharanya   | Shetty     |
|        4 | Hs@gmail.co           | 7878     | $2b$10$uFdaj0sjYRnt5AJovH.mdudO6Zdw0FuTVNCFyCTGRK4XyVwN.Ioy2 | IndiGo       | Harshit    | Srivastava |
|        5 | abhinav6137@gmail.com | 234      | $2b$10$gAZR6r9j/p9Jl.0mCg2huOPhoOs0.pILdu12qbp1Qo1cF16u/pezu | GoAir        | Abhinav    | Mohapatra  |
|        6 | ac@gmail.com          | 4367     | $2b$10$3lgz22S8ACdD6tZThQZbt.P61y.vrutlzJV7rQGcU6iRgQMJSVtri | GoAir        | Ajitha     | Chalasani  |
|        7 | ak@gmail.com          | 092      | $2b$10$AYqsUCC6G.Ii9tgdD8jmb.bDyye80UFXP4iQBezLBNZzCmQuEEajC | AirAsia      | Anisha     | Kumari     |
|        8 | mn@gmail.com          | 531768   | $2b$10$KuCRo5jgAp5EmO2HLYr/COF65UYKoom2UcjSnQ2oVnxK9cl0r0BIu | SpiceJet     | Manvi      | Nayak      |
+----------+-----------------------+----------+--------------------------------------------------------------+--------------+------------+------------+
7 rows in set (0.00 sec)

mysql> SELECT * FROM airlines;
+--------------+
| airline_name |
+--------------+
| Air India    |
| AirAsia      |
| GoAir        |
| IndiGo       |
| SpiceJet     |
| Vistara      |
+--------------+
6 rows in set (0.00 sec)

mysql> SELECT * FROM airports;
+------------+-----------+
| airport_id | location  |
+------------+-----------+
| BLR        | Bangalore |
| BOM        | Mumbai    |
| CCU        | Kolkata   |
| DEL        | Delhi     |
| HYD        | Hyderabad |
| IXE        | Manipal   |
| MAA        | Chennai   |
+------------+-----------+
7 rows in set (0.00 sec)

mysql> SELECT * FROM deleted_airlines;
+--------------+---------------------+
| airline_name | deleted_at          |
+--------------+---------------------+
| Air India    | 2025-04-06 16:21:07 |
| IndiGo       | 2025-04-06 16:21:07 |
| SpiceJet     | 2025-04-06 16:21:07 |
| Vistara      | 2025-04-06 16:21:07 |
+--------------+---------------------+
4 rows in set (0.00 sec)

mysql> SELECT * FROM deleted_flight_instances;
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+---------------------+
| instance_id | flight_no | airline_name | route_id | departure_time      | arrival_time        | price   | deleted_at          |
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+---------------------+
|           1 |       123 | GoAir        |        8 | 2025-04-15 17:29:00 | 2025-04-16 17:29:00 | 2345.00 | 2025-04-06 17:50:35 |
|           2 |       456 | GoAir        |        8 | 2025-04-15 17:30:00 | 2025-04-17 17:30:00 |  123.00 | 2025-04-06 17:53:12 |
|           7 |       527 | Air India    |        8 | 2025-04-15 21:36:00 | 2025-04-16 11:40:00 |  -18.00 | 2025-04-06 17:35:04 |
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+---------------------+
3 rows in set (0.00 sec)

mysql> SELECT * FROM deleted_flight_routes;
Empty set (0.00 sec)

mysql> SELECT * FROM deleted_flights;
+-----------+--------------+----------+---------------------+
| flight_no | airline_name | max_seat | deleted_at          |
+-----------+--------------+----------+---------------------+
|       456 | GoAir        |       23 | 2025-04-06 17:53:12 |
+-----------+--------------+----------+---------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM deleted_tickets;
+-----------+-------------+---------+-------------+------------------+--------------------------+-------------+---------------------+---------------------+
| ticket_id | seat_number | user_id | instance_id | name             | email                    | phone_no    | booking_time        | deleted_at          |
+-----------+-------------+---------+-------------+------------------+--------------------------+-------------+---------------------+---------------------+
|         4 | 1           |       1 |           1 | Aditya Sinha     | adityasinha347@gmail.com | 07828160035 | 2025-04-06 17:40:25 | 2025-04-06 17:50:35 |
|         5 | 6           |       1 |           1 | Kumar Manish Raj | kmraj0007@gmail.com      | 09836399456 | 2025-04-06 17:40:25 | 2025-04-06 17:50:35 |
|         6 | 4           |       1 |           1 | Sharanya Shetty  | adityasinha347@gmail.com | 09836399456 | 2025-04-06 17:40:25 | 2025-04-06 17:50:35 |
|         7 | 2           |       1 |           1 | Kumar Manish Raj | kmraj0007@gmail.com      | 09836399456 | 2025-04-06 17:40:25 | 2025-04-06 17:50:35 |
+-----------+-------------+---------+-------------+------------------+--------------------------+-------------+---------------------+---------------------+
4 rows in set (0.00 sec)

mysql> SELECT * FROM flight_instances;
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+
| instance_id | flight_no | airline_name | route_id | departure_time      | arrival_time        | price   |
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+
|           3 |       123 | GoAir        |        8 | 2025-04-15 17:30:00 | 2025-04-16 23:48:00 |  342.00 |
|           4 |       101 | IndiGo       |        8 | 2025-04-15 17:31:00 | 2025-04-16 21:34:00 | 2345.00 |
|           5 |       563 | IndiGo       |        8 | 2025-04-15 20:37:00 | 2025-04-17 22:36:00 |  743.00 |
|           6 |       103 | SpiceJet     |        8 | 2025-04-15 17:33:00 | 2025-04-17 21:39:00 | 3654.00 |
|           8 |       527 | Air India    |        8 | 2025-04-15 22:38:00 | 2025-04-16 10:38:00 |  147.00 |
+-------------+-----------+--------------+----------+---------------------+---------------------+---------+
5 rows in set (0.00 sec)

mysql> SELECT * FROM flight_routes;
+----------+----------------------+--------------------+
| route_id | departure_airport_id | arrival_airport_id |
+----------+----------------------+--------------------+
|        1 | DEL                  | BOM                |
|        2 | DEL                  | BLR                |
|        3 | BOM                  | MAA                |
|        4 | BLR                  | HYD                |
|        5 | MAA                  | CCU                |
|        6 | HYD                  | DEL                |
|        7 | CCU                  | BOM                |
|        8 | IXE                  | BLR                |
+----------+----------------------+--------------------+
8 rows in set (0.00 sec)

mysql> SELECT * FROM flights;
+-----------+--------------+----------+
| flight_no | airline_name | max_seat |
+-----------+--------------+----------+
|       101 | IndiGo       |      180 |
|       102 | Air India    |      150 |
|       103 | SpiceJet     |      160 |
|       123 | GoAir        |        6 |
|       527 | Air India    |       15 |
|       563 | IndiGo       |       12 |
+-----------+--------------+----------+
6 rows in set (0.00 sec)

mysql> SELECT * FROM tickets;
+-----------+-------------+---------+-------------+--------------------------+-------------+---------------------+--------------+-----------+
| ticket_id | seat_number | user_id | instance_id | email                    | phone_no    | booking_time        | first_name   | last_name |
+-----------+-------------+---------+-------------+--------------------------+-------------+---------------------+--------------+-----------+
|         1 | 14          |       1 |           4 | adityasinha347@gmail.com | 07828160035 | 2025-04-06 17:38:32 | Aditya       | Sinha     |
|         2 | 27          |       1 |           4 | kmraj0007@gmail.com      | 09836399456 | 2025-04-06 17:38:32 | Kumar Manish | Raj       |
|         3 | 17          |       1 |           4 | adityasinha347@gmail.com | 09836399456 | 2025-04-06 17:38:32 | Sharanya     | Shetty    |
|         8 | 23          |       2 |           6 | adityasinha347@gmail.com | 07828160035 | 2025-04-06 17:47:48 | Aditya       | Sinha     |
|         9 | 25          |       2 |           6 | kmraj0007@gmail.com      | 09836399456 | 2025-04-06 17:47:48 | Kumar Manish | Raj       |
|        10 | 38          |       2 |           6 | adityasinha347@gmail.com | 09836399456 | 2025-04-06 17:47:48 | Sharanya     | Shetty    |
|        11 | 142         |       2 |           6 | kmraj0007@gmail.com      | 09836399456 | 2025-04-06 17:47:48 | Kumar Manish | Raj       |
+-----------+-------------+---------+-------------+--------------------------+-------------+---------------------+--------------+-----------+
7 rows in set (0.00 sec)

mysql> SELECT * FROM users;
+---------+-------------------------------+-------------+--------------------------------------------------------------+------------+-----------+
| user_id | email                         | phone_no    | password                                                     | first_name | last_name |
+---------+-------------------------------+-------------+--------------------------------------------------------------+------------+-----------+
|       1 | adityasinha13112004@gmail.com | 7828160035  | $2b$10$52BekUQF9l6M6GUZ1OEDo.gSdUWRW1T4mLWaMbQUcvgHjBJNfVnC6 | Aditya     | Sinha     |
|       2 | ss11@gmail.com                | 123456789   | $2b$10$268t.13nLI1JU7Zj2GP9q.L2MTlt81OCUZIOc.0o4bV.4kcOllTBC | Sharanya   | Shetty    |
|       3 | abhinav6137@gmail.com         | 09836399456 | $2b$10$2VKf3mBnwKbWGE5pBGBEtOxQXbjs.VLT8j2dz9aw/q5QN7cQhZ2fa | Abhinav    | Mohapatra |
+---------+-------------------------------+-------------+--------------------------------------------------------------+------------+-----------+
3 rows in set (0.00 sec)
