import sys

# Use this file to write your queries. Submit this file in Brightspace after finishing your homework.

#TODO: Write your username and answer to each query as a string in the return statements in the functions below. 
# Do not change the function names. 

#Your resulting tables should have the attributes in the same order as appeared in the sample answers. 

#Make sure to test that python prints out the strings (your username and SQL queries) correctly.

#usage: python hw1.py or python3 hw1.py
# make sure the program prints out your SQL statements correctly. That means the autograder will read you SQL correctly. Running the Python file will not execute your SQL statements (just prints them).

def username():
	return "flemin53@purdue.edu" # Write your username here
    
def query1():
	return """
  Select *
	FROM trip t1
	WHERE t1.duration = (SELECT MIN(t2.duration) FROM trip t2) OR t1.duration = (SELECT MAX(t3.duration) FROM trip t3);
	"""

def query2():
	return """
	Select id, duration, start_station_id, end_station_id, bike_id, subscription_type, zip_code, start_d, end_d
	FROM (SELECT *, MIN(duration) as mindur FROM trip GROUP BY DATE(start_d) HAVING duration = mindur
		UNION
		SELECT *, MAX(duration) as maxdur FROM trip GROUP BY DATE(start_d) HAVING duration = maxdur);
	"""

def query3():
	return """
  SELECT id, name, lat, long, dock_count, city, install_date
	FROM (SELECT *, COUNT(*) as cnt FROM station GROUP BY dock_count HAVING cnt = 1);
	"""

	
def query4():
	return """
	SELECT *
	FROM (
		SELECT s.id, s.name, ROUND(avg_docks_available/s.dock_count, 2) as percentage_docks_available
		FROM station s
		JOIN (
			SELECT station_id, AVG(docks_available) as avg_docks_available
			FROM station_status
			GROUP BY station_id
		) ss
		ON ss.station_id = s.id
		ORDER BY percentage_docks_available ASC
	)
	WHERE percentage_docks_available = (
		SELECT MAX(ROUND(avg_docks_available/s.dock_count, 2))
		FROM station s
		JOIN (
			SELECT station_id, AVG(docks_available) as avg_docks_available
			FROM station_status
			GROUP BY station_id
		) ss
		ON ss.station_id = s.id
	) OR percentage_docks_available = (
		SELECT MIN(ROUND(avg_docks_available/s.dock_count, 2))
		FROM station s
		JOIN (
			SELECT station_id, AVG(docks_available) as avg_docks_available
			FROM station_status
			GROUP BY station_id
		) ss
		ON ss.station_id = s.id
	);
	"""


def query5():
	return """
		SELECT s.id, s.name, s.dock_count, ROUND(avg_docks_available/s.dock_count, 2) as percentage_docks_available
		FROM station s
		JOIN (
			SELECT station_id, AVG(docks_available) as avg_docks_available
			FROM station_status
			GROUP BY station_id
		) ss
		ON ss.station_id = s.id
		WHERE dock_count < (SELECT AVG(dock_count) FROM station) AND percentage_docks_available < .5;
	"""


def query6(): #This one is wrong
	return """
	SELECT w1.zip_code, w1.max_temp, w2.zip_code, w2.max_temp
	FROM (
		SELECT id, zip_code, MAX(max_temperature_f) as max_temp
		FROM (
			SELECT *
			FROM daily_weather
			WHERE ((max_temperature_f/1) <> 0)
		)
		GROUP BY zip_code
	) w1
	JOIN (
		SELECT id, zip_code, MAX(max_temperature_f) as max_temp
		FROM (
			SELECT *
			FROM daily_weather
			WHERE ((max_temperature_f/1) <> 0)
		)
		GROUP BY zip_code
	) w2
	ON w2.id < w1.id
	WHERE w1.max_temp = w2.max_temp;
	"""


def query7(): #this one is wrong
	return """
	SELECT w1.zip_code, DATE(w1.date) as date, w1.max_temperature_f
	FROM daily_weather w1
	WHERE w1.max_temperature_f = (
		SELECT MAX(w2.max_temperature_f)
		FROM (
			SELECT *
			FROM daily_weather w3
			WHERE ((max_temperature_f/1) <> 0)
		) w2
		GROUP BY zip_code
		HAVING w2.zip_code = w1.zip_code
	);
	"""


def query8():
	return """
	SELECT s1.name, s2.name, COUNT(t.id) as trip_count, ROUND(AVG(t.duration), 2) as avg_duration
	FROM trip t
	JOIN station s1
	ON t.start_station_id = s1.id
	JOIN station s2
	ON t.end_station_id = s2.id
	GROUP BY t.start_station_id, t.end_station_id
	ORDER BY trip_count DESC
	LIMIT 1;
	"""


def query9():
	return """
	SELECT status.station_id, 
	       s.name, 
		   strftime('%H', status.time) as hour,
		   ROUND(AVG(status.bikes_available), 2) as avg_bikes_available, 
		   ROUND(AVG(status.docks_available), 2) as avg_docks_available
	FROM station_status AS status
	JOIN station s
		ON status.station_id = s.id
	GROUP BY hour, status.station_id
	HAVING status.station_id = 46
	ORDER BY avg_bikes_available ASC
	LIMIT 1;
	"""


def query10():
	return """
	SELECT DISTINCT s1.name, s2.name, ROUND((SQRT(POW(s1.lat-s2.lat, 2) + POW(s1.long-s2.long, 2))), 6) as euclidian_distance
	FROM station s1
	JOIN station s2
	ON s1.id <> s2.id AND s1.id < s2.id
	WHERE euclidian_distance IN (
		SELECT ROUND((SQRT(POW(s3.lat-s4.lat, 2) + POW(s3.long-s4.long, 2))), 6) as euclidian_distance
		FROM station s3
		JOIN station s4
		ON s3.id <> s4.id AND s3.id < s4.id
		ORDER BY euclidian_distance ASC
		LIMIT 2
	);
	"""


def query11():
	return """
	SELECT station.id as StationID, station.name,
	COALESCE(
		(
			SELECT COUNT(*)
			FROM (
				SELECT trip.id 
				FROM trip 
				WHERE trip.start_station_id = station.id OR trip.end_station_id = station.id
			)
		),
	0) as number_of_trips, (
		SELECT ROUND(AVG(number_of_trips), 2)
		FROM (
			SELECT *,
			COALESCE(
				(
					SELECT COUNT(*)
					FROM (
						SELECT trip.id 
						FROM trip 
						WHERE trip.start_station_id = station.id OR trip.end_station_id = station.id
					)
				),
			0) as number_of_trips
			FROM station
			ORDER BY number_of_trips ASC
		)
	) as avg_number_of_trips, (
		SELECT FORMAT('%.1f', MAX(number_of_trips))
		FROM (
			SELECT *,
			COALESCE(
				(
					SELECT COUNT(*)
					FROM (
						SELECT trip.id 
						FROM trip 
						WHERE trip.start_station_id = station.id OR trip.end_station_id = station.id
					)
				),
			0) as number_of_trips
			FROM station
			ORDER BY number_of_trips ASC
		)
	) as max_number_of_trips
	FROM station
	ORDER BY number_of_trips ASC
	LIMIT 20;
	"""


def query12():
	return """
	SELECT s.id, s.name, s.city, qt.number_of_trips, ROUND(city_avg, 2) as city_avg, FORMAT('%.1f', city_max) as city_max
	FROM station s
	JOIN (
		SELECT DISTINCT s.id, s.city, COUNT(t.id) as number_of_trips
		FROM station s
		JOIN (
			SELECT *, s1.city as start_city, s2.city as end_city
			FROM trip
			JOIN station s1
			ON start_station_id = s1.id
			JOIN station s2
			ON end_station_id = s2.id
			WHERE start_city = end_city
		) t
		ON t.start_station_id = s.id OR t.end_station_id = s.id
		GROUP BY s.id
	) qt
	ON s.id = qt.id
	JOIN (
		SELECT city, MAX(number_of_trips) as city_max, AVG(number_of_trips) as city_avg
		FROM (
			SELECT DISTINCT s.id, s.city, COUNT(t.id) as number_of_trips
			FROM station s
			JOIN (
				SELECT *, s1.city as start_city, s2.city as end_city
				FROM trip
				JOIN station s1
				ON start_station_id = s1.id
				JOIN station s2
				ON end_station_id = s2.id
				WHERE start_city = end_city
			) t
			ON t.start_station_id = s.id OR t.end_station_id = s.id
			GROUP BY s.id
		)
		GROUP BY city
	) ct
	ON s.city = ct.city
	WHERE qt.number_of_trips <= 15
	ORDER BY s.city, qt.number_of_trips;
	"""


def query13():
	return """
	SELECT s.city, NULLIF(SUM(t.subscription_type = 'Customer'), 0) as Customer, NULLIF(SUM(t.subscription_type = 'Subscriber'), 0) as Subscriber
	FROM trip t
	JOIN station s
	ON t.start_station_id = s.id
	GROUP BY s.city;
	"""



#Do not edit below

def main():
	query_options = {1: query1(), 2: query2(), 3: query3(), 4: query4(), 5: query5(), 6: query6(), 7: query7(), 8: query8(), 
		9: query9(), 10: query10(), 11: query11(), 12: query12(), 13: query13()}
	
	if len(sys.argv) == 1:
		if username() == "username":
			print("Make sure to change the username function to return your username.")
			return
		else:
			print(username())
		for query in query_options.values():
			print(query)
	elif len(sys.argv) == 2:
		if sys.argv[1] == "username":
			print(username())
		else:
			print(query_options[int(sys.argv[1])])

	
if __name__ == "__main__":
   main()
