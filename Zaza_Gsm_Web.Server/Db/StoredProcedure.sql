USE shopping_Zaza_gsm;

DELIMITER ;;
DROP PROCEDURE IF EXISTS `GetClients`;
CREATE PROCEDURE `GetClients`() READS SQL DATA
BEGIN
/*
  `client_id` bigint(10) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
*/
	SELECT
		`client_id`,
		`full_name`,
        `phone_number`,
        `email`,
        `address`
	FROM `clients`;
END;;

DROP FUNCTION IF EXISTS GenerateId;;
CREATE FUNCTION GenerateId() RETURNS BIGINT
BEGIN
    -- Generáljunk 64 bites véletlen számot RAND()-dal
    RETURN FLOOR(RAND() * (POWER(2, 63) - 1));
END ;;

DROP PROCEDURE IF EXISTS GetClientById;;
CREATE PROCEDURE GetClientById(pId BIGINT) READS SQL DATA
BEGIN
    -- Generáljunk 64 bites véletlen számot RAND()-dal
    SELECT
		`client_id`,
		`full_name`,
        `phone_number`,
        `email`,
        `address`
	FROM `clients`
    WHERE `client_id` = pId;
END ;;

DROP PROCEDURE IF EXISTS `AddClient`;;
CREATE PROCEDURE `AddClient` (`p_full_name` VARCHAR(255), `p_phone_number` VARCHAR(50), `p_email` VARCHAR(255), `p_address` VARCHAR(255)) MODIFIES SQL DATA
BEGIN 
	DECLARE newId BIGINT;
    SELECT `GenerateId`() INTO newId;
    START TRANSACTION;
    INSERT INTO `clients` (`client_id`, `full_name`, `phone_number`, `email`, `address`)
		VALUES (newId, `p_full_name`, `p_phone_number`, `p_email`, `p_address`);
	COMMIT;
    SELECT newId;
END;;

DROP PROCEDURE IF EXISTS `DeleteClient`;;
CREATE PROCEDURE `DeleteClient` (`p_client_Id` BIGINT) MODIFIES SQL DATA
BEGIN 
    DECLARE `oldId` BIGINT;
    START TRANSACTION;
    DELETE FROM `clients` WHERE `client_id` = `p_client_Id`;
    SELECT `client_id` INTO `oldId` FROM `clients` WHERE `client_id` = `p_client_Id`;
    IF `oldId` IS NULL THEN
		COMMIT;
        SELECT TRUE;
	ELSE
		ROLLBACK;
        SELECT FALSE;
    END IF;
END;;

DELIMITER ;