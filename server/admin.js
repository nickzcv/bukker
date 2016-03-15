var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	basic_auth = require('basic-auth'),
	path = require('path');

/* admin page */
router.get('/admin', function (req, res) {
	var user = basic_auth(req);
	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name != 'nick' && user.pass != '5687004a')
		return req.app.locals.unauthorized(res);

	var db = req.db,
		books = db.get('books');

	var options = {
		"limit": 30,
		"skip": 0,
		"sort": {date : -1}
	};

	books.find({},options,function(err, books){
		if (err) throw err;
		res.render('admin', res.locals.template_data = {
			layout: 'admin',
			meta_title: 'Admin Books ('+books.length+')',
			count: books.length,
			book: books
		});
		//res.json(books);
	});
});

module.exports = router;
