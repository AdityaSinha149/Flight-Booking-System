DELIMITER //

CREATE PROCEDURE InsertTickets(
    IN p_first_names TEXT,
    IN p_last_names TEXT,
    IN p_emails TEXT,
    IN p_phone_nos TEXT,
    IN p_user_ids INT,
    IN p_instance_id INT,
    IN p_seat_numbers TEXT
)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE totalCount INT;
    DECLARE user_id_value INT;
    DECLARE seat_number_value VARCHAR(10);
    DECLARE first_name_value VARCHAR(50);
    DECLARE last_name_value VARCHAR(50);
    DECLARE email_value VARCHAR(255);
    DECLARE phone_no_value VARCHAR(20);

    -- Calculate the number of entries
    SET totalCount = LENGTH(p_first_names) - LENGTH(REPLACE(p_first_names, ',', '')) + 1;

    -- Set user_id_value once
    SET user_id_value = p_user_ids;

    WHILE i <= totalCount DO
        -- Extract current values from CSV strings
        SET first_name_value = TRIM(SUBSTRING_INDEX(p_first_names, ',', 1));
        SET p_first_names = IF(LOCATE(',', p_first_names) > 0, SUBSTRING(p_first_names FROM LOCATE(',', p_first_names) + 1), '');

        SET last_name_value = TRIM(SUBSTRING_INDEX(p_last_names, ',', 1));
        SET p_last_names = IF(LOCATE(',', p_last_names) > 0, SUBSTRING(p_last_names FROM LOCATE(',', p_last_names) + 1), '');

        SET email_value = TRIM(SUBSTRING_INDEX(p_emails, ',', 1));
        SET p_emails = IF(LOCATE(',', p_emails) > 0, SUBSTRING(p_emails FROM LOCATE(',', p_emails) + 1), '');

        SET phone_no_value = TRIM(SUBSTRING_INDEX(p_phone_nos, ',', 1));
        SET p_phone_nos = IF(LOCATE(',', p_phone_nos) > 0, SUBSTRING(p_phone_nos FROM LOCATE(',', p_phone_nos) + 1), '');

        SET seat_number_value = TRIM(SUBSTRING_INDEX(p_seat_numbers, ',', 1));
        SET p_seat_numbers = IF(LOCATE(',', p_seat_numbers) > 0, SUBSTRING(p_seat_numbers FROM LOCATE(',', p_seat_numbers) + 1), '');

        -- Insert into tickets table
        INSERT INTO tickets (first_name, last_name, email, phone_no, seat_number, user_id, instance_id)
        VALUES (first_name_value, last_name_value, email_value, phone_no_value, seat_number_value, user_id_value, p_instance_id);

        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;
