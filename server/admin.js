var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* admin page */
router.get('/admin', function (req, res) {
	var db = req.db,
		books = db.get('books'),
		totalBooks = 0;


	books.find({},{},function(err, allBooks){
		if (err) throw err;
		if (allBooks) {
			totalBooks = allBooks.length;

			res.render('admin', res.locals.template_data = {
				layout: 'admin',
				meta_title: 'Админка - главная страница',
				totalBooks: totalBooks
			});

		} else {
			console.log("error")
		}
	});



});

module.exports = router;
