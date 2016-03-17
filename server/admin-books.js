var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* admin Books page */
router.get('/admin/books', function (req, res) {
	var db = req.db,
		books = db.get('books'),
		limit = 10, //books per page
		totalBooks = 0,
		pageCount = 1;

	//try to get page N
	var page =  req.query.page;
	if(!page){
		page = 1;
	}
	//get sort param
	var sort =  req.query.sort;
	if(!sort){
		sort = {date : -1}
	}

	books.find({},{},function(err, allBooks){
		if (err) throw err;
		if (allBooks) {
			totalBooks = allBooks.length;
			pageCount = Math.ceil(totalBooks / limit);

			var options = {
				"limit": limit,
				"skip": limit*(page-1),
				"sort": sort
			};

			books.find({},options,function(err, books){
				if (err) throw err;
				res.render('admin-books', res.locals.template_data = {
					layout: 'admin',
					meta_title: 'Книги ('+totalBooks+'шт.)',
					pagination: {
						page: page,
						pageCount: pageCount
					},
					book: books
				});
			});

		} else {
			console.log("error")
		}
	});



});

module.exports = router;
