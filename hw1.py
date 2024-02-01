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
    SELECT trip.id, trip.start_station_id, station.name, start_d, end_d, duration
		FROM trip
	  INNER JOIN station ON station.id=trip.start_station_id
		WHERE trip.id <= 7450;
	"""

def query2():
	return """
	SELECT origin_station.name as origin_station, trip.start_d, trip.duration, destination_station.name as destination_station
	FROM trip
	JOIN station origin_station
	ON trip.start_station_id = origin_station.id
	JOIN station destination_station
	ON trip.end_station_id = destination_station.id
	WHERE trip.id <= 7450;
	"""

def query3():
	return """
	SELECT origin_station.name, destination_station.name, COUNT(*) as cnt, ROUND(AVG(duration), 2) as avg_duration
	FROM trip
	JOIN station origin_station
	ON trip.start_station_id = origin_station.id
	JOIN station destination_station
	ON trip.end_station_id = destination_station.id
	GROUP BY trip.end_station_id, trip.start_station_id
	HAVING cnt >= 10
	ORDER BY cnt;
	"""

	
def query4():
	return """
	SELECT DISTINCT date(trip.start_d) as date, AVG(weather.max_temperature_f) as avg_temp, COUNT(DISTINCT trip.id) as number_trips
	FROM trip
	JOIN daily_weather weather
	ON DATE(trip.start_d) = DATE(weather.date)
	GROUP BY date(start_d)
	ORDER BY number_trips ASC;
	"""


def query5():
	return """
	SELECT strftime('%H', time) as hour, ROUND(AVG(bikes_available), 2) as avg_bikes_available, ROUND(AVG(docks_available), 2) as avg_docks_available
	FROM station_status
	GROUP BY strftime('%H', time)
	ORDER BY avg_bikes_available ASC
	LIMIT 10;
	"""


def query6():
	return """
	SELECT DISTINCT s1.name, s2.name, ROUND((SQRT(POW(s1.lat-s2.lat, 2) + POW(s1.long-s2.long, 2))), 6) as euclidian_distance
	FROM station s1
	JOIN station s2
	ON s1.id <> s2.id AND s1.id < s2.id
	ORDER BY euclidian_distance ASC
	limit 10;
	"""


def query7():
	return """
	SELECT trip.id, s1.name, s2.name, ROUND((SQRT(POW(s1.lat-s2.lat, 2) + POW(s1.long-s2.long, 2))), 6) as euclidian_distance, trip.duration
	FROM trip
	JOIN station s1
		ON trip.start_station_id = s1.id
	JOIN station s2
		ON trip.end_station_id = s2.id
	ORDER BY euclidian_distance DESC
	LIMIT 5;
	"""


def query8():
	return """
	SELECT w1.zip_code, DATE(w1.date), DATE(w2.date), w1.mean_temperature_f, w1.precipitation_inches
	FROM daily_weather AS w1
	JOIN daily_weather AS w2
		ON w2.zip_code = w1.zip_code AND DATE(w1.date) < DATE(w2.date)
	WHERE w1.precipitation_inches > .01 AND w1.mean_temperature_f = w2.mean_temperature_f AND w1.precipitation_inches = w2.precipitation_inches AND w1.precipitation_inches <> 'T';
	"""


def query9():
	return """
	SELECT DATE(t1.start_d), t1.bike_id, SUBSTRING(s1.name, 1, 20) as start_station, SUBSTRING(s2.name, 1, 20) as middle_station, SUBSTRING(s3.name, 1, 20) as end_station, 
		ROUND((SQRT(POW(s1.lat-s3.lat, 2) + POW(s1.long-s3.long, 2))) , 6) as euclidian_distance
	FROM trip AS t1
	JOIN trip AS t2
		ON DATE(t1.start_d) = DATE(t2.start_d) AND t1.end_station_id = t2.start_station_id AND t1.bike_id = t2.bike_id
	JOIN station AS s1
		ON t1.start_station_id = s1.id
	JOIN station AS s2
		ON t1.end_station_id = s2.id
	JOIN station AS s3
		ON t2.end_station_id = s3.id
	ORDER BY euclidian_distance DESC
	LIMIT 5;
	"""


def query10():
	return """
	SELECT trip.end_station_id, s.name, 1 as num, 'number of arriving trips' as num_description
	FROM trip
	JOIN station s
		ON trip.end_station_id = s.id
	GROUP BY end_station_id
	HAVING COUNT(*) = 1
	UNION
	SELECT s.id, s.name, sstatus.bikes_available as num, 'bikes available' as num_description
	FROM station s
	JOIN station_status sstatus
		ON s.id = sstatus.station_id
	WHERE num >= 23;
	"""


def query11():
	return """
	SELECT station.id as StationID, station.name,
	  COALESCE(
			(SELECT COUNT(*)
			FROM (
			  SELECT trip.id 
			  FROM trip 
			  WHERE trip.start_station_id = station.id OR trip.end_station_id = station.id)), 0) as number_of_trips
	FROM station
	ORDER BY number_of_trips ASC
	LIMIT 20;
	"""


def query12():
	return """
	SELECT bike_id
	FROM trip
	JOIN station
	ON trip.end_station_id = station.id
	WHERE station.name = 'Evelyn Park and Ride'
	INTERSECT
	SELECT bike_id
	FROM trip
	JOIN station
	ON trip.end_station_id = station.id
	WHERE station.name = 'Mountain View Caltrain Station';
	"""


def query13():
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
	HAVING status.station_id = 46;
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
