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
 db.movies.find( { "awards.wins": { $gt: 200 } }, { _id: 0, title: 1, "awards_wins": "$awards.wins" } )
	"""

def query3():
	return """
db.movies.find({$and: [ {"imdb.rating": { $gt: 9.0}}, {"imdb.votes": { $gt: 100}} ]}, { _id: 0, title: 1, "imdb.rating": 1, "imdb.votes": 1 } )
	"""

def query4():
	return """
db.movies.aggregate([{$unwind:{path: "$directors"}},{$match:{$and: [{year: {$gte: 1915}},{year: {$lte: 1920}}]}},{$group:{_id: "$directors", count_of_movies: {$sum: 1}}}])
	"""

def query5():
	return """
db.comments.aggregate([
  {
    $lookup:
      {
        from: "movies",
        localField: "movie_id",
        foreignField: "_id",
        as: "result",
      },
  },
  {
    $unwind:
      {
        path: "$result",
      },
  },
  {
    $group:
      {
        _id: "$name",
        count_of_comments: {
          $sum: 1,
        },
        average_movie_ratings: {
          $avg: "$result.imdb.rating",
        },
      },
  },
  {
    $match:
      {
        count_of_comments: {
          $gt: 250,
        },
      },
  },
])
	"""

def query6():
	return """
db.movies.aggregate([
  {
    $match: {
      year: 1996
    }
  },
  {
    $unwind: {
      path: "$cast"
    }
  },
  {
    $group: {
      _id: "$cast",
      count_of_movies: {
        $sum: 1
      }
    }
  },
  {
    $match:
      {
        count_of_movies: {
          $gt: 3
        }
      }
  }
])
	"""

def query7():
	return """
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $unwind: {
      path: "$movie",
    },
  },
  {
    $match: {
      "movie.genres": {
        $elemMatch: {
          $eq: "Crime",
        },
      },
    },
  },
  {
    $group: {
      _id: "$name",
      comment_count: {
        $sum: 1,
      },
    },
  },
  {
    $match: {
      comment_count: {
        $gt: 35,
      },
    },
  },
  {
    $project:
      {
        name: "$_id",
        _id: 0,
        comment_count: 1,
      },
  },
])
	"""

def query8():
	return """
db.movies.aggregate([
  {
    $unwind:
      {
        path: "$directors",
      },
  },
  {
    $unwind:
      {
        path: "$cast",
      },
  },
  {
    $match:
      {
        $expr: {
          $eq: ["$directors", "$cast"],
        },
      },
  },
  {
    $project:
      {
        _id: 1,
        title: 1,
        directors: 1,
      },
  },
])
	"""

if __name__ == "__main__":
	try:
		if all(type(eval(f'query{f}()'))==str for f in range(1,9)):
			print('Your submission is valid.')
		else:
			raise TypeError('Invalid Return Types.')
	except Exception as e:
		print(f'Your submission is invalid.\n{instr}\n{e}')
