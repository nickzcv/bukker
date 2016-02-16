var express    = require('express'),
	minify     = require('html-minifier').minify,
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	router     = express.Router(),
	transport  = nodemailer.createTransport();



// Home page.
router.get('/', function (req, res) {
	res.render('home', res.locals.template_data);
});


router.use(bodyparser.urlencoded({
	extended: false
}));


module.exports = router;
