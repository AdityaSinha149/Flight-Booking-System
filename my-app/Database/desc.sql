mysql> show tables;
+---------------------------+
| Tables_in_airline_booking |
+---------------------------+
| admin                     |
| airlines                  |
| airports                  |
| deleted_airlines          |
| deleted_flight_instances  |
| deleted_flight_routes     |
| deleted_flights           |
| deleted_tickets           |
| flight_instances          |
| flight_routes             |
| flights                   |
| tickets                   |
| users                     |
+---------------------------+
13 rows in set (0.13 sec)

mysql> DESC admin;
+--------------+--------------+------+-----+---------+----------------+
| Field        | Type         | Null | Key | Default | Extra          |
+--------------+--------------+------+-----+---------+----------------+
| admin_id     | int          | NO   | PRI | NULL    | auto_increment |
| email        | varchar(100) | NO   | UNI | NULL    |                |
| phone_no     | varchar(20)  | NO   | UNI | NULL    |                |
| pass         | varchar(255) | NO   |     | NULL    |                |
| airline_name | varchar(100) | NO   | MUL | NULL    |                |
| first_name   | varchar(50)  | NO   |     | NULL    |                |
| last_name    | varchar(50)  | NO   |     | NULL    |                |
+--------------+--------------+------+-----+---------+----------------+
7 rows in set (0.11 sec)

mysql> DESC airlines;
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| airline_name | varchar(255) | NO   | PRI | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
1 row in set (0.00 sec)

mysql> DESC airports;
+------------+--------------+------+-----+---------+-------+
| Field      | Type         | Null | Key | Default | Extra |
+------------+--------------+------+-----+---------+-------+
| airport_id | varchar(3)   | NO   | PRI | NULL    |       |
| location   | varchar(255) | NO   |     | NULL    |       |
+------------+--------------+------+-----+---------+-------+
2 rows in set (0.00 sec)

mysql> DESC deleted_airlines;
+--------------+--------------+------+-----+-------------------+-------------------+
| Field        | Type         | Null | Key | Default           | Extra             |
+--------------+--------------+------+-----+-------------------+-------------------+
| airline_name | varchar(255) | NO   | PRI | NULL              |                   |
| deleted_at   | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+--------------+--------------+------+-----+-------------------+-------------------+
2 rows in set (0.02 sec)

mysql> DESC deleted_flight_instances;
+----------------+---------------+------+-----+-------------------+-------------------+
| Field          | Type          | Null | Key | Default           | Extra             |
+----------------+---------------+------+-----+-------------------+-------------------+
| instance_id    | int           | NO   | PRI | NULL              |                   |
| flight_no      | int           | NO   |     | NULL              |                   |
| airline_name   | varchar(255)  | NO   |     | NULL              |                   |
| route_id       | int           | NO   |     | NULL              |                   |
| departure_time | datetime      | NO   |     | NULL              |                   |
| arrival_time   | datetime      | NO   |     | NULL              |                   |
| price          | decimal(10,2) | NO   |     | NULL              |                   |
| deleted_at     | timestamp     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+----------------+---------------+------+-----+-------------------+-------------------+
8 rows in set (0.00 sec)

mysql> DESC deleted_flight_routes;
+----------------------+------------+------+-----+-------------------+-------------------+
| Field                | Type       | Null | Key | Default           | Extra             |
+----------------------+------------+------+-----+-------------------+-------------------+
| route_id             | int        | NO   | PRI | NULL              |                   |
| departure_airport_id | varchar(3) | NO   |     | NULL              |                   |
| arrival_airport_id   | varchar(3) | NO   |     | NULL              |                   |
| deleted_at           | timestamp  | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+----------------------+------------+------+-----+-------------------+-------------------+
4 rows in set (0.00 sec)

mysql> DESC deleted_flights;
+--------------+--------------+------+-----+-------------------+-------------------+
| Field        | Type         | Null | Key | Default           | Extra             |
+--------------+--------------+------+-----+-------------------+-------------------+
| flight_no    | int          | NO   |     | NULL              |                   |
| airline_name | varchar(255) | NO   |     | NULL              |                   |
| max_seat     | int          | NO   |     | NULL              |                   |
| deleted_at   | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+--------------+--------------+------+-----+-------------------+-------------------+
4 rows in set (0.00 sec)

mysql> DESC deleted_tickets;
+--------------+--------------+------+-----+-------------------+-------------------+
| Field        | Type         | Null | Key | Default           | Extra             |
+--------------+--------------+------+-----+-------------------+-------------------+
| ticket_id    | int          | NO   | PRI | NULL              |                   |
| seat_number  | varchar(10)  | NO   |     | NULL              |                   |
| user_id      | int          | NO   |     | NULL              |                   |
| instance_id  | int          | NO   |     | NULL              |                   |
| name         | varchar(255) | NO   |     | NULL              |                   |
| email        | varchar(255) | NO   |     | NULL              |                   |
| phone_no     | varchar(20)  | NO   |     | NULL              |                   |
| booking_time | timestamp    | YES  |     | NULL              |                   |
| deleted_at   | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+--------------+--------------+------+-----+-------------------+-------------------+
9 rows in set (0.00 sec)

mysql> DESC flight_instances;
+----------------+---------------+------+-----+---------+----------------+
| Field          | Type          | Null | Key | Default | Extra          |
+----------------+---------------+------+-----+---------+----------------+
| instance_id    | int           | NO   | PRI | NULL    | auto_increment |
| flight_no      | int           | NO   | MUL | NULL    |                |
| airline_name   | varchar(255)  | NO   |     | NULL    |                |
| route_id       | int           | NO   | MUL | NULL    |                |
| departure_time | datetime      | NO   |     | NULL    |                |
| arrival_time   | datetime      | NO   |     | NULL    |                |
| price          | decimal(10,2) | NO   |     | NULL    |                |
+----------------+---------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)

mysql> DESC flight_routes;
+----------------------+------------+------+-----+---------+----------------+
| Field                | Type       | Null | Key | Default | Extra          |
+----------------------+------------+------+-----+---------+----------------+
| route_id             | int        | NO   | PRI | NULL    | auto_increment |
| departure_airport_id | varchar(3) | NO   | MUL | NULL    |                |
| arrival_airport_id   | varchar(3) | NO   | MUL | NULL    |                |
+----------------------+------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

mysql> DESC flights;
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| flight_no    | int          | NO   | PRI | NULL    |       |
| airline_name | varchar(255) | NO   | PRI | NULL    |       |
| max_seat     | int          | NO   |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
3 rows in set (0.00 sec)

mysql> DESC tickets;
+--------------+--------------+------+-----+-------------------+-------------------+
| Field        | Type         | Null | Key | Default           | Extra             |
+--------------+--------------+------+-----+-------------------+-------------------+
| ticket_id    | int          | NO   | PRI | NULL              | auto_increment    |
| seat_number  | varchar(10)  | NO   |     | NULL              |                   |
| user_id      | int          | NO   | MUL | NULL              |                   |
| instance_id  | int          | NO   | MUL | NULL              |                   |
| email        | varchar(255) | NO   |     | NULL              |                   |
| phone_no     | varchar(20)  | NO   |     | NULL              |                   |
| booking_time | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| first_name   | varchar(50)  | NO   |     | NULL              |                   |
| last_name    | varchar(50)  | NO   |     | NULL              |                   |
+--------------+--------------+------+-----+-------------------+-------------------+
9 rows in set (0.00 sec)

mysql> DESC users;
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| user_id    | int          | NO   | PRI | NULL    | auto_increment |
| email      | varchar(255) | NO   | UNI | NULL    |                |
| phone_no   | varchar(20)  | NO   | UNI | NULL    |                |
| password   | varchar(255) | NO   |     | NULL    |                |
| first_name | varchar(50)  | NO   |     | NULL    |                |
| last_name  | varchar(50)  | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
6 rows in set (0.00 sec)

mysql>