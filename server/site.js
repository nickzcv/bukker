var express    = require('express'),
	router     = express.Router(),
	request = require('request'),
	getSlug = require('speakingurl'),
	path = require('path'),
	bodyparser = require('body-parser'),
	mime = require('mime');

/* sitemap.xml
router.get('/sitemap.xml', function(req, res) {
	res.sendFile(path.join(__dirname, '../public', 'sitemap.xml'));
});
 
router.get('/friends.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../','friends.html'));
});
*/
//robots.txt
router.get('/robots.txt', function (req, res) {
	res.sendfile('robots.txt')
});
/* Home page. */
router.get('/', function(req, res) {
	var db = req.db,
		books = db.get('books'),
		news = db.get('news');

	books.find({},{limit: 20, sort: {date: -1}},function(err, books){
		if (err) throw err;
		if (books) {
			news.find({},{limit: 3, sort: {date: -1}},function(err, news){
				if (err) throw err;
				res.render('home', res.locals.template_data = {
					layout: 'main',
					meta_title: 'Рейтинг книг на Буккер.ру — выбирайте, читайте и скачивайте электронные книги',
					book: books,
					news: news
				});
			});
		}

	});
});

/* contacts page. */
router.get('/contacts', function(req, res) {
	res.render('contacts', res.locals.template_data = {
		layout: 'main',
		active: { contacts: true },
		meta_title: 'Буккер.ру — страница обратной связи'
	});
});

/* info page. */
router.get('/info', function(req, res) {
	res.render('info', res.locals.template_data = {
		layout: 'main',
		active: { info: true },
		meta_title: 'Буккер.ру — информация о сайте'
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
		limit = 36, //books per page
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
		sort = {}
	}

	//books.find({},{},function(err, allBooks){
		//if (err) throw err;
		//if (allBooks) {
			totalBooks = 31065;//allBooks.length;
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

		//} else {
		//	console.log("error")
		//}
	//});
	//cookie test
	//res.cookie('sorting', 'dateAsk2');
	//console.log("Cookies: ", req.cookies.sorting);
});

/* Ganre books */
router.get('/ganre/:url', function(req, res, next) {
	var db = req.db,
		url = String(req.params.url),
		ganreTitle = "",
		books = db.get('books'),
		limit = 50, //books per page
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
			}, function (err, allBooksInGanre) {
				if (err) throw err;
				if (allBooksInGanre) {
					totalBooks = allBooksInGanre.length;
					pageCount = Math.ceil(totalBooks / limit);

					var options = {
						"limit": limit,
						"skip": limit*(page-1),
						"sort": sort
					};

					//get books by ganre
					books.find({
						"ganres.url": url
					},options, function (err, books) {
						if (err) throw err;
						if (books) {
							res.render('ganre', res.locals.template_data = {
								layout: 'main',
								active: { ganres: true },
								meta_title: ganreTitle,
								meta_total_books: totalBooks,
								pagination: {
									page: page,
									pageCount: pageCount
								},
								books: books
							});
						} else {
							next();
						}
					});//end get books by ganre

				} else {
					next();
				}
			});//end get books
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
			meta_title: 'Книги по Жанрам',
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

router.use(bodyparser.urlencoded({
	extended: false
}));

router.post('/search', function(req, res) {
	var db = req.db,
		string = String(req.body.searching),
		books = db.get('books');

	console.log(req.body.searching);
	console.log(string);

	var query = {
		title: {
			$regex: string,
			$options: 'i' //i: ignore case, m: multiline, etc
		}
	};
	books.find(query,{limit:150},function(err, books){
		if (err) res.json(err);
		if (books) {
			res.render('search', res.locals.template_data = {
				layout: 'main',
				meta_title: string,
				books: books
			});
		} else {
			next();
		}
	});
});

module.exports = router;
