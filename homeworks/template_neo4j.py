instr = '''Instructions:
	Please put the queries under the corresponding functions below.
	Running this python file will check if the formatting is okay.
'''

def query1():
	return """
	match (region:Region)--(continent:Continent) return region.name, continent.name
	"""

def query2():
	return """
	MATCH (region:Region)--(azone:AvailabilityZone) return region.name, azone.name
	"""

def query3():
	return """
  MATCH (e:EC2InstanceType) RETURN e.family, count(*) as cnt
	"""

def query4():
	return """
	MATCH (e:EC2InstanceType)--(p:Price) return e.name, p.cost_per_hour/e.memory as price_per_GB order by price_per_GB asc limit 1
	"""

def query5():
	return """
MATCH (s:Service) -- (r:Region)
WITH 
    s as service,
    count(*) as number_of_regions,
    COLLECT{
        MATCH (s) -- (r1:Region) 
        RETURN r1.name} 
    as region_name_list
WHERE number_of_regions >= 6
RETURN service.name, number_of_regions, region_name_list
ORDER BY number_of_regions DESC, service.name ASC
	"""

def query6():
	return """
MATCH (region:Region) -- (price:Price) -- (instance:EC2InstanceType)
WHERE region.name = "N. Virginia" AND price.cost_per_hour > 1
RETURN region.name, price.cost_per_hour, instance.name
	"""

def query7():
	return """
MATCH (s:Service)
WITH s as a,
    COUNT{
        MATCH (s) -- (r:Region) -- (c:Continent) 
        RETURN distinct c
    } as number_of_continent
WHERE number_of_continent = 5
RETURN a.name, number_of_continent
	"""

def query8():
	return """
MATCH (r:Region) -- (s1:Service), (r) -- (s2:Service)
WHERE s1.name = "AWS Data Pipeline" AND s2.name = "Amazon Kinesis"
RETURN r.name
	"""

def query9():
	return """
MATCH (r:Region) -- (s1:Service)
WHERE s1.name = "Amazon Simple Email Service" AND
    COUNT{MATCH (r) -- (s2:Service) WHERE s2.name = "AWS Data Pipeline"} = 0
RETURN r.name
	"""

def query10():
	return """
MATCH (instance:EC2InstanceType) -- (a:Service)
WHERE instance.name = "Â i2.2xlarge"
    AND COUNT {MATCH (i2:EC2InstanceType) -- (a) WHERE i2.name <> "Â i2.2xlarge" RETURN i2} = 0
RETURN a.name, "offered only on i2.2xlarge" as description
UNION
MATCH (instance:EC2InstanceType) -- (a:Service) -- (instance2:EC2InstanceType)
WHERE instance.name = "Â i2.2xlarge"
    AND instance2.name = "c3.2xlarge"
RETURN a.name, "offered on i2.2xlarge and c3.2xlarge" as description
	"""

if __name__ == "__main__":
	try:
		if all(type(eval(f'query{f}()'))==str for f in range(1,11)):
			print('Your submission is valid.')
		else:
			raise TypeError('Invalid Return Types.')
	except Exception as e:
		print(f'Your submission is invalid.\n{instr}\n{e}')
