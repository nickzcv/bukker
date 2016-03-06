var express    = require('express'),
	router     = express.Router(),
	bodyparser = require('body-parser'),
	getSlug = require('speakingurl'),
	multer = require('multer'),
	request = require('request'),
	mime = require('mime'),
	upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'covers');
			},
			filename: function (req, file, cb) {
				cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
			}
		})
	});

/* GET BOOKS list. */
router.get('/', function(req, res) {
	var db = req.db,
		books = db.get('books');

	books.find({},{},function(err, books){
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

/* Ganres page */
router.get('/ganres', function (req, res) {
	res.render('ganres', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Жанры'
	});
});

/* Tags page */
router.get('/tags', function (req, res) {
	res.render('tags', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Тэги'
	});
});

/* ADD BOOK page */
router.get('/addbook', function (req, res) {
	res.render('addbook', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Добавление книги в Буккер'
	});
});


router.use(bodyparser.urlencoded({
	extended: false
}));

/* Adding BOOK to DB */
router.post('/addbook', upload.single('cover'), function(req, res) {
	var db = req.db,
		books = db.get('books'),
	//save form data
		title = req.body.title,
		description = req.body.description,
		year = parseInt(req.body.year),
		authors = req.body.authors.split(','),
		ganres = req.body.ganres.split(','),
		tags = req.body.tags.split(','),
		url = getSlug(title),
		litresid = req.body.litresid,
		cover = 'default.png';
		if(req.file){
			cover = req.file.filename
		}

	books.findOne({
		"url": url
	}, function (err, bookForCheck) {
		if (err) res.json(err);
		if (bookForCheck) {
			res.redirect(req.get('referer')+'#exist');
		} else {
			//start insert book to database
			books.insert({
				'title' : title,
				'description' : description,
				'year': year,
				'authors' : authors,
				'ganres': ganres,
				'tags': tags,
				'date': new Date(),
				'cover' : cover,
				'litresid' : litresid,
				'url' : url
			}, function (error, curent) {
				if (error) {
					res.redirect(req.get('referer')+'#eroor');
				} else {
					res.location('/');
					res.redirect('/');
				}

			});//end insert book to database
		}
	});

});




module.exports = router;
