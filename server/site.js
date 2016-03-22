var express    = require('express'),
	router     = express.Router(),
	request = require('request'),
	mime = require('mime');


/* Home page. */
router.get('/', function(req, res) {
	var db = req.db,
		books = db.get('books');

	var options = {
		"limit": 20,
		"sort": {date : -1}
	};

	books.find({},options,function(err, books){
		if (err) throw err;
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Буккер - рейтинги книг',
			book: books
		});
		//res.json(books);
	});
});

/* GET BOOK by url slug */
router.get('/book/:url', function(req, res, next) {
	var db = req.db,
		url = req.params.url,
		books = db.get('books');

	books.findOne({
		"url": String(url)
	}, function (err, book) {
		if (err) res.json(err);
		if (book) {
			 res.render('book', res.locals.template_data = {
				 layout: 'main',
				 active: { books: true },
				 meta_title: book.title,
				 litres_ref_id: '156223639',
				 book: book
			 });
			//console.log(book);
		} else {
			next();
		}
	});
});

/* GET BOOKS list. */
router.get('/books', function(req, res) {
	var db = req.db,
		books = db.get('books'),
		limit = 25, //books per page
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
				res.render('books', res.locals.template_data = {
					layout: 'main',
					active: { books: true },
					meta_title: 'Книги',
					meta_total_books: totalBooks,
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
	//cookie test
	//res.cookie('sorting', 'dateAsk2');
	//console.log("Cookies: ", req.cookies.sorting);
});

/* Ganre books */
router.get('/ganre/:url', function(req, res, next) {
	var db = req.db,
		url = String(req.params.url),
		ganreTitle = "",
		books = db.get('books');

	//get ganre title
	books.findOne({
		"ganres.url": url
	}, function (err, book) {
		if (err) throw err;
		if (book) {
			for (i = 0; i < book.ganres.length; i++) {
				if( book.ganres[i].url == url){
					ganreTitle = book.ganres[i].title;
				}
			}
			//get books by ganre
			books.find({
				"ganres.url": url
			}, function (err, books) {
				if (err) throw err;
				if (books) {
					res.render('ganre', res.locals.template_data = {
						layout: 'main',
						active: { ganres: true },
						meta_title: ganreTitle,
						books: books
					});
				} else {
					next();
				}
			});//end get books by ganre
		} else {
			next();
		}
	});

});
/* all Ganres  */
router.get('/ganres', function (req, res) {
	var db = req.db,
		ganres = db.get('ganres');

	var options = {
		"sort": {title : 1}
	};

	ganres.find({},options,function(err, ganres){
		if (err) throw err;
		res.render('ganres', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Жанры',
			active: { ganres: true },
			ganre: ganres
		});
		//console.log(ganres);
	});
});
/* Tag books */
router.get('/tag/:url', function(req, res, next) {
	var db = req.db,
		url = String(req.params.url),
		tagTitle = "",
		books = db.get('books');
	//get tag title
	books.findOne({
		"tags.url": url
	}, function (err, book) {
		if (err) throw err;
		if (book) {
			for (i = 0; i < book.tags.length; i++) {
				if( book.tags[i].url == url){
					tagTitle = book.tags[i].title;
				}
			}
			//get books by tag
			books.find({
				"tags.url": url
			}, function (err, books) {
				if (err) throw err;
				if (books) {
					res.render('tag', res.locals.template_data = {
						layout: 'main',
						meta_title: tagTitle,
						books: books
					});
				} else {
					next();
				}
			});//end get books by tag
		} else {
			next();
		}
	});

});



module.exports = router;
