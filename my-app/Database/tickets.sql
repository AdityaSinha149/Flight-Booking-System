DELIMITER //

CREATE PROCEDURE InsertTickets(
    IN p_names TEXT,
    IN p_emails TEXT,
    IN p_phone_nos TEXT,
    IN p_user_ids INT, -- changed to INT
    IN p_flight_no INT,
    IN p_seat_numbers TEXT,
    IN p_airline VARCHAR(255)
)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE totalCount INT;
    DECLARE user_id_value INT; -- changed to INT
    DECLARE seat_number_value VARCHAR(10);
    DECLARE name_value VARCHAR(255);
    DECLARE email_value VARCHAR(255);
    DECLARE phone_no_value VARCHAR(20);
    DECLARE instance_id_value INT;

    -- Determine instance_id using flight_no and airline_name
    SELECT instance_id INTO instance_id_value
    FROM flight_instances
    WHERE flight_no = p_flight_no AND airline_name = p_airline
    ORDER BY departure_time ASC
    LIMIT 1; 

    -- Ensure an instance exists
    IF instance_id_value IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No matching flight instance found.';
    END IF;

    -- Calculate the number of entries
    SET totalCount = LENGTH(p_names) - LENGTH(REPLACE(p_names, ',', '')) + 1;

    -- Set user_id_value once
    SET user_id_value = p_user_ids; -- assign directly

    WHILE i <= totalCount DO
        -- Extract current values from CSV strings
        SET name_value = TRIM(SUBSTRING_INDEX(p_names, ',', 1));
        SET p_names = IF(LOCATE(',', p_names) > 0, SUBSTRING(p_names FROM LOCATE(',', p_names) + 1), '');

        SET email_value = TRIM(SUBSTRING_INDEX(p_emails, ',', 1));
        SET p_emails = IF(LOCATE(',', p_emails) > 0, SUBSTRING(p_emails FROM LOCATE(',', p_emails) + 1), '');

        SET phone_no_value = TRIM(SUBSTRING_INDEX(p_phone_nos, ',', 1));
        SET p_phone_nos = IF(LOCATE(',', p_phone_nos) > 0, SUBSTRING(p_phone_nos FROM LOCATE(',', p_phone_nos) + 1), '');

        SET seat_number_value = TRIM(SUBSTRING_INDEX(p_seat_numbers, ',', 1));
        SET p_seat_numbers = IF(LOCATE(',', p_seat_numbers) > 0, SUBSTRING(p_seat_numbers FROM LOCATE(',', p_seat_numbers) + 1), '');

        -- Insert into tickets table
        INSERT INTO tickets (name, email, phone_no, seat_number, user_id, instance_id)
        VALUES (name_value, email_value, phone_no_value, seat_number_value, user_id_value, instance_id_value);

        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;
