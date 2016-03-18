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
			meta_title: 'Новости',
			news: news
		});
		//res.json(books);
	});

});

module.exports = router;
