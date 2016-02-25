var express    = require('express'),
	minify     = require('html-minifier').minify,
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	router     = express.Router();

// Home page.
/*
router.get('/', function (req, res) {
	res.render('home', res.locals.template_data);
});
*/

/* GET BOOKS list. */
router.get('/', function(req, res) {
	var db = req.db;
	var collection = db.get('books');
	collection.find({},{},function(err, docs){
		if (err) throw err;
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Bukker2',
			docs: docs
		});
		//res.json(docs);
	});
});

router.use(bodyparser.urlencoded({
	extended: false
}));

router.post('/', function(req, res) {
	console.log(req.body.title);
	var db = req.db,
		title = req.body.title,
		description = req.body.description,
		author = req.body.author,
		cover = req.body.cover,
		books = db.get('books');
	books.insert({
		'title' : title,
		'description' : description,
		'author' : author,
		'cover' : cover
	}, function (error, doc) {
		if (error) {
			res.send("Could not create new book.");
		} else {
			res.location('/');
			res.redirect('/');
		}

	});
});




module.exports = router;
