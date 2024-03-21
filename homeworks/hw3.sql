DROP PROCEDURE IF EXISTS running_avg1;
DROP PROCEDURE IF EXISTS running_avg2;
DELIMITER $$
CREATE PROCEDURE running_avg1(IN csid INT)
BEGIN
	DECLARE done BOOL DEFAULT false;
    DECLARE currdate DATETIME;
    DECLARE ss_cursor CURSOR FOR
      SELECT date_time
      FROM station_status
      WHERE station_id = csid
      AND date_time >= '2013-09-01 12:00:00'
      AND date_time <= '2013-09-01 13:00:00'
      ORDER BY date_time ASC;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
    OPEN ss_cursor;

    DROP TABLE IF EXISTS sp1_result;

CREATE TABLE sp1_result (
    date_time DATETIME,
    bikes_available_avg DECIMAL(10 , 4 ),
    docks_available_avg DECIMAL(10 , 4 )
);

	repeatlabel: REPEAT
	  FETCH ss_cursor INTO currdate;
      	  IF done THEN
		LEAVE repeatlabel;
	  END IF;
      INSERT INTO sp1_result (
        SELECT currdate, AVG(ss1.bikes_available), AVG(ss1.docks_available)
        FROM station_status ss1 
        WHERE ss1.station_id = csid 
        AND DATE(ss1.date_time) = DATE(currdate)
        AND TIMEDIFF(TIME(currdate), TIME(ss1.date_time)) <= '00:10:00'
        AND TIMEDIFF(TIME(currdate), TIME(ss1.date_time)) >= '00:00:00'
      );
	UNTIL done
	END REPEAT repeatlabel;
    
	CLOSE ss_cursor;
  END $$

CREATE PROCEDURE running_avg2(IN csid INT)
BEGIN
	DECLARE done BOOL DEFAULT false;
    DECLARE currdate DATETIME;
    DECLARE ss_cursor CURSOR FOR
      SELECT date_time
      FROM station_status
      WHERE station_id = csid
      AND date_time >= '2013-09-01 12:00:00'
      AND date_time <= '2013-09-01 13:00:00'
      ORDER BY date_time ASC;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = true;
    OPEN ss_cursor;
    
	DROP TABLE IF EXISTS sp2_result;
    
CREATE TABLE sp2_result (
    date_time DATETIME,
    bikes_available DECIMAL(10 , 4 )
);
    
	repeatlabel: REPEAT
	  FETCH ss_cursor INTO currdate;
      	  IF done THEN
		LEAVE repeatlabel;
	  END IF;
      INSERT INTO sp2_result (
		SELECT currdate, AVG(bikes)
		FROM (
			SELECT currdate, ss1.bikes_available as bikes
			FROM station_status ss1 
			WHERE ss1.station_id = csid 
			AND DATE(ss1.date_time) = DATE(currdate)
			AND TIME(ss1.date_time) >= '12:00:00'
			AND TIME (ss1.date_time) <= TIME(currdate)
			ORDER BY ss1.date_time DESC
			LIMIT 5
		) AS innerQuery
      );
	UNTIL done
	END REPEAT repeatlabel;
    
END
DELIMITER ;