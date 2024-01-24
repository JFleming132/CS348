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
	SELECT origin_station.name, destination_station.name, COUNT(*) as cnt, FORMAT('%.2f', AVG(duration)) as avg_duration
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
	SELECT strftime('%H', time) as hour, format('%.2f', AVG(bikes_available)) as avg_bikes_available, format('%.2f', AVG(docks_available)) as avg_docks_available
	FROM station_status
	GROUP BY strftime('%H', time)
	ORDER BY avg_bikes_available ASC
	LIMIT 10;
	"""


def query6(): #need to get rid of repeat pairs somehow, try UNIQUE or DISTINCT
	return """
	SELECT s1.name, s2.name, (SQRT(POW(s1.lat-s2.lat, 2) + POW(s1.long-s2.long, 2))) as euclidian_distance
	FROM station s1
	JOIN station s2
	ON s1.id <> s2.id
	ORDER BY euclidian_distance ASC
	limit 10;
	"""


def query7():
	return """
	"""


def query8():
	return """
	"""


def query9():
	return """
	"""


def query10():
	return """
	"""


def query11():
	return """
	"""


def query12():
	return """
	"""


def query13():
	return """
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
