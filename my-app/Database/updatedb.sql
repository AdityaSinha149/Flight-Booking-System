DELIMITER //

CREATE PROCEDURE InsertTickets(
    IN p_names TEXT,
    IN p_emails TEXT,
    IN p_phone_nos TEXT,
    IN p_user_ids TEXT,
    IN p_flight_nos TEXT,
    IN p_seat_numbers TEXT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE name_value VARCHAR(100);
    DECLARE email_value VARCHAR(100);
    DECLARE phone_value VARCHAR(20);
    DECLARE user_id_value INT;
    DECLARE flight_no_value INT;
    DECLARE seat_number_value VARCHAR(10);

    DECLARE name_cursor CURSOR FOR SELECT value FROM STRING_SPLIT(p_names, ',');
    DECLARE email_cursor CURSOR FOR SELECT value FROM STRING_SPLIT(p_emails, ',');
    DECLARE phone_cursor CURSOR FOR SELECT value FROM STRING_SPLIT(p_phone_nos, ',');
    DECLARE user_cursor CURSOR FOR SELECT CAST(value AS UNSIGNED) FROM STRING_SPLIT(p_user_ids, ',');
    DECLARE flight_cursor CURSOR FOR SELECT CAST(value AS UNSIGNED) FROM STRING_SPLIT(p_flight_nos, ',');
    DECLARE seat_cursor CURSOR FOR SELECT value FROM STRING_SPLIT(p_seat_numbers, ',');

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN name_cursor;
    OPEN email_cursor;
    OPEN phone_cursor;
    OPEN user_cursor;
    OPEN flight_cursor;
    OPEN seat_cursor;

    read_loop: LOOP
        FETCH name_cursor INTO name_value;
        FETCH email_cursor INTO email_value;
        FETCH phone_cursor INTO phone_value;
        FETCH user_cursor INTO user_id_value;
        FETCH flight_cursor INTO flight_no_value;
        FETCH seat_cursor INTO seat_number_value;

        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO tickets (seat_number, user_id, name, email, phone_no)
        VALUES (seat_number_value, user_id_value, name_value, email_value, phone_value);
    END LOOP;

    CLOSE name_cursor;
    CLOSE email_cursor;
    CLOSE phone_cursor;
    CLOSE user_cursor;
    CLOSE flight_cursor;
    CLOSE seat_cursor;
END //

DELIMITER ;
