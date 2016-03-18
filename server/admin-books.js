var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path'),
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
					active: { books: true },
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

/* ADD BOOK page */
router.get('/admin/addbook', function (req, res) {
	res.render('admin-addbook', res.locals.template_data = {
		layout: 'admin',
		active: { books: true },
		meta_title: 'Добавление книги'
	});
});

router.use(bodyparser.urlencoded({
	extended: false
}));

/* Adding BOOK to DB */
router.post('/admin/addbook', upload.single('cover'), function(req, res) {
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
					res.location('/admin/books');
					res.redirect('/admin/books');
				}

			});//end insert book to database
		}
	});

});


module.exports = router;
