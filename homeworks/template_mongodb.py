instr = '''Instructions:
	Please put the queries under the corresponding functions below.
	Running this python file will check if the formatting is okay.
'''

def query1():
	return """
	"""

def query2():
	return """
	"""

def query3():
	return """
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
