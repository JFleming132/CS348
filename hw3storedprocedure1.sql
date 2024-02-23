CREATE DEFINER=`root`@`%` PROCEDURE `HW3_STORED_PROCEDURE_1`(IN csid INT)
BEGIN
	DECLARE done BOOL DEFAULT false;
    DECLARE currdate DATETIME;
    DECLARE ss_cursor CURSOR FOR
      SELECT date_time
      FROM station_status
      WHERE station_id = csid
      AND date_time >= '2013-09-01 12:00:00'
      AND date_time <= '2013-09-01 13:00:00';
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
    OPEN ss_cursor;

    DROP TABLE IF EXISTS sp1_result;

CREATE TABLE sp1_result (
    date_time DATETIME,
    bikes_available_avg DECIMAL(10 , 4 ),
    docks_available_avg DECIMAL(10 , 4 )
);

	REPEAT
	  select currdate;
	  FETCH ss_cursor INTO currdate;
      INSERT INTO sp1_result (
        SELECT MAX(ss1.date_time), AVG(ss1.bikes_available), AVG(ss1.docks_available) FROM station_status ss1 WHERE ss1.station_id = csid AND TIMEDIFF(ss1.date_time, currdate) <= '00:10:00'
      );
	UNTIL done
	END REPEAT;
    
	CLOSE ss_cursor;
  END