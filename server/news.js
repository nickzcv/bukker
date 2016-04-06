var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');



/* news page */
router.get('/news', function (req, res) {
	var db = req.db,
		news = db.get('news');

	news.find({},{sort: {date: -1}},function(err, news){
		if (err) throw err;
		res.render('news', res.locals.template_data = {
			layout: 'main',
			active: { news: true },
			meta_title: 'Литературные новости и лучшие подборки книг',
			news: news
		});

	});

});

/* GET news by url slug */
router.get('/news/:url', function(req, res, next) {
	var db = req.db,
		url = req.params.url,
		news = db.get('news');

	news.findOne({
		"url": String(url)
	}, function (err, news) {
		if (err) res.json(err);
		if (news) {
			res.render('news-page', res.locals.template_data = {
				layout: 'main',
				active: { news: true },
				meta_title: news.title,
				news: news
			});
		} else {
			next();
		}
	});
});

module.exports = router;
