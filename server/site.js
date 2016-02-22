var express    = require('express'),
	minify     = require('html-minifier').minify,
	bodyparser = require('body-parser'),
	nodemailer = require('nodemailer'),
	router     = express.Router();

// Home page.
router.get('/', function (req, res) {
	res.render('home', res.locals.template_data);
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('home', res.locals.template_data = {
			layout: 'main',
			meta_title: 'Bukker2',
			docs: docs
		});
		console.log(docs);
	});
});

router.use(bodyparser.urlencoded({
	extended: false
}));


module.exports = router;
