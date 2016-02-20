var express    = require('express'),
	minify     = require('html-minifier').minify,
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	router     = express.Router(),
	transport  = nodemailer.createTransport(),
	db = require('./db');

// Home page.
router.get('/', function (req, res) {

	db.query('SELECT * FROM book', function(err, results) {
		if (err) throw err;
		console.log(results[0].id_book);
		console.log(results[0].title);
		console.log(results[0].description);
		console.log(results[0].rating);
	});

	res.render('home', res.locals.template_data);
});


router.use(bodyparser.urlencoded({
	extended: false
}));


module.exports = router;
