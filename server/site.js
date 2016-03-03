var express    = require('express'),
	router     = express.Router(),
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	getSlug = require('speakingurl'),
	multer = require('multer'),
	request = require('request'),
	fs = require('fs'),
	path = require('path'),
	cheerio = require('cheerio'),
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

// litres parser


router.get('/litres/', function (req, res, next) {
	var db = req.db,
		books = db.get('books');

	//url = req.params.url;
	url = 'http://www.litres.ru/aleksandr-shumovich/smeshat-no-ne-vzbaltyvat-recepty-organizacii-meropriyatiy/';

	//function to save cover
	var download = function(uri, filename, callback){
		request.head(uri, function(err, res, body){
			console.log('content-type:', res.headers['content-type']);
			console.log('content-length:', res.headers['content-length']);

			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var litresRefID = "156223639";

			var book = {
				title:"",
				description:"",
				year:"",
				authors:"",
				ganres:"",
				tags:"",
				date:"",
				cover:"",
				litresid:"",
				url:""
			};

			book.title = $('#main-div .book-title').text();
			book.description = $('#main-div .book_annotation').text();
			book.year = $('#main-div dd[itemprop=datePublished]').text();

			//authors get all
			var authors = [];
			$('#main-div .book-author a').each(function(i, elem) {
				authors[i] = $(this).text();
			});
			book.authors = authors.join(', ');

			//ganres get all
			var ganres = [];
			$('#main-div dd a[itemprop=genre]').each(function(i, elem) {
				ganres[i] = $(this).text();
			});
			book.ganres = ganres.join(', ');

			//tags get all
			var tags = [];
			$('#main-div dd:nth-child(6)').each(function(i, elem) {
				tags[i] = $(this).text();
			});
			book.tags = tags.join(', ');

			var cover = $('#main-div .bookpage-cover img:nth-child(2)').attr("src");
			var newName = 'cover-' + Date.now() + path.extname(cover);
			download(cover, 'covers/'+newName, function(){
				console.log('done');
			});
			book.cover = newName;

			var litresid = $('link[rel=shortlink]').attr("href");
			book.litresid = litresid.slice(21);

			book.url = getSlug(book.title);

			/* adding to DB */

			books.insert({
				'title' : book.title,
				'description' : book.description,
				'year': book.year,
				'authors' : book.authors,
				'ganres': book.ganres,
				'tags': book.tags,
				'date': new Date(),
				'cover' : book.cover,
				'litresid' : book.litresid,
				'url' : book.url
			}, function (error, curent) {
				if (error) {
					res.send("Could not create new book.");
				} else {
					console.log("Inserted");
					//res.location('/');
					//res.redirect('/');
				}

			});

			console.log(book);
			next();

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
			 /*res.render('home', res.locals.template_data = {
				 layout: 'main',
				 meta_title: 'Буккер',
				 book: book
			 });*/
			res.json(book);
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
		//validation
		title = req.body.title,
		description = req.body.description,
		author = req.body.author,
		year = parseInt(req.body.year),
		ganre = req.body.ganre,
		url = getSlug(title),
		cover = 'default.png';
		if(req.file){
			cover = req.file.filename
		}
	//books.index('url', { unique: true });
	//insert to database
	books.insert({
		'title' : title,
		'description' : description,
		'author' : author,
		'year': year,
		'ganres': ganre,
		'date': new Date(),
		'cover' : cover,
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
