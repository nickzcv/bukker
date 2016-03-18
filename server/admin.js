var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* admin page */
router.get('/admin', function (req, res) {
	var db = req.db,
		books = db.get('books'),
		news = db.get('news'),
		totalBooks = 0,
		totalNews = 0;

	books.find({},{},function(err, allBooks){
		if (err) throw err;
		if (allBooks) {
			totalBooks = allBooks.length;
			news.find({},{},function(err, allNews){
				if (err) throw err;
				if (allNews) {
					totalNews = allNews.length;
					res.render('admin', res.locals.template_data = {
						layout: 'admin',
						meta_title: 'Админка - главная страница',
						totalBooks: totalBooks,
						totalNews: totalNews
					});
				} else {
					console.log("error get news")
				}
			});
		} else {
			console.log("error get books")
		}
	});

});


module.exports = router;
