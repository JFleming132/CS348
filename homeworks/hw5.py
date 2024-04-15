
instr = '''Instructions:
	Please put the SQL queries in the corresponding functions below
'''

def q2_c():
	return """
	Select e.*
	from Employee e
	JOIN (
		Select sq.id, max(sq.timestamp) as maxTimestamp
		FROM (
		Select *
		from Employee
		WHERE timestamp <= 103
		) as sq
		GROUP BY sq.id
	) as jq ON jq.id = e.id 
	where timestamp = maxTimestamp;
	"""

def q2_d():
	return """
	SELECT e1.id,
           e1.timestamp as t1, 
           e2.timestamp as t2, 
           e1.dept_id, 
           e1.dept_name as dept_name_at_t1, 
           e2.dept_name as dept_name_at_t2
	FROM Employee e1
	JOIN Employee e2 ON e1.id = e2.id 
	AND dept_name_at_t1 <> dept_name_at_t2 
	AND t2 > t1 
	AND e1.dept_id = e2.dept_id
	WHERE t1 = (
  		SELECT min(s1.timestamp)
		FROM Employee s1
		JOIN Employee s2 ON s1.id = s2.id 
		AND s1.dept_name <> s2.dept_name 
		AND s2.timestamp > s1.timestamp 
		AND s1.dept_id = s2.dept_id
		WHERE s1.id = e1.id and s1.dept_id = e1.dept_id
	) AND t2 = (
		select min(q2.timestamp)
		FROM Employee q1
		JOIN Employee q2 ON q1.id = q2.id 
		AND q1.dept_name <> q2.dept_name 
		AND q2.timestamp > q1.timestamp 
		AND q1.dept_id = q2.dept_id
		WHERE q1.id = e1.id and q1.dept_id = e1.dept_id
	);
	"""

def q2_e():
	return """
	SELECT e.id, e.name, e.salary, e.dept_id, min_dept_name as dept_name, e.timestamp
	FROM Employee AS e
	JOIN (
			select dept_id, dept_name as min_dept_name, min(timestamp)
			FROM Employee uvw
			Group by uvw.dept_id
			) AS s ON s.dept_id = e.dept_id 
	ORDER BY id, timestamp ASC;
	"""

	
if __name__ == "__main__":
	try:
		if all(type(f()) == str for f in (q2_c, q2_d, q2_e)):
			print('Your submission file is valid.')
		else:
			print(instr)
	except Exception as e:
		print(instr)
		print(e)
