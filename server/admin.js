var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	basic_auth = require('basic-auth'),
	path = require('path');

/* admin page */
router.get('/admin', function (req, res) {
	var user = basic_auth(req);
	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name != 'nick' && user.pass != '5687004a')
		return req.app.locals.unauthorized(res);

	var db = req.db,
		books = db.get('books'),
		limit = 10,
		sort = {date : -1},
		totalBooks = 0,
		pageCount = 1;


	//try to get page N
	var page =  req.query.page;
	if(!page){
		page = 1;
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

			console.log( options.limit );
			console.log( options.skip );

			books.find({},options,function(err, books){
				if (err) throw err;
				res.render('admin', res.locals.template_data = {
					layout: 'admin',
					meta_title: 'Admin Books ('+totalBooks+')',
					pagination: {
						page: page,
						pageCount: pageCount
					},
					book: books
				});
				//res.json(books);
			});

		} else {
			console.log("error")
		}
	});



});

module.exports = router;
