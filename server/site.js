var express    = require('express'),
	router     = express.Router(),
	request = require('request'),
	mime = require('mime');


/* Home page. */
router.get('/', function(req, res) {
	var db = req.db,
		books = db.get('books');

	books.find({},{sort: {date: -1}},function(err, books){
		if (err) throw err;
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Буккер',
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
		books = db.get('books');

	books.find( {} ,{},function(err, books){
		if (err) throw err;
		res.render('books', res.locals.template_data = {
			layout: 'main',
			active: { books: true },
			meta_title: 'Книги',
			book: books
		});
		//res.json(books);
	});
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
