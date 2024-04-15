instr = '''Instructions:
	Please put the queries under the corresponding functions below.
	Running this python file will check if the formatting is okay.
'''

def query1():
	return """
db.movies.find( { year: 1928 }, {_id: 0, title: 1, plot: 1 } )
	"""

def query2():
	return """
 db.movies.find( { "awards.wins": { $gt: 200 } }, { _id: 0, title: 1, "awards.wins": 1 } )
	"""

def query3():
	return """
db.movies.find({$and: [ {"imdb.rating": { $gt: 9.0}}, {"imdb.votes": { $gt: 100}} ]}, { _id: 0, title: 1, "imdb.rating": 1, "imdb.votes": 1 } )
	"""

def query4():
	return """
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

if __name__ == "__main__":
	try:
		if all(type(eval(f'query{f}()'))==str for f in range(1,9)):
			print('Your submission is valid.')
		else:
			raise TypeError('Invalid Return Types.')
	except Exception as e:
		print(f'Your submission is invalid.\n{instr}\n{e}')
