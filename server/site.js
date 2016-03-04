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
		collection = db.get('books');

	collection.find({},{},function(err, books){
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
router.get('/book/:url', function(req, res) {
	var db = req.db,
		url = req.params.url,
		collection = db.get('books');

	collection.findOne({ url: url }, function (err, book) {
		if (err) { /* handle err */ }

		if (book) {
			 res.render('book', res.locals.template_data = {
				 layout: 'main',
				 meta_title: book.title,
				 litres_ref_id: '156223639',
				 book: book
			 });
			//res.json(book);
		} else {
			res.status(404);
		}

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
	//books.index('url', { unique: true });
	//insert to database
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
			res.send("Could not create new book.");
		} else {
			console.log("Inserted");
			res.location('/');
			res.redirect('/');
		}

	});
});




module.exports = router;
