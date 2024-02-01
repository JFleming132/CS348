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
	erm
	"""


def query5():
	return """
	"""


def query6():
	return """
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