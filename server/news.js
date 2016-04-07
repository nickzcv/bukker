var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');



/* news page */
router.get('/news', function (req, res) {
	var db = req.db,
		news = db.get('news'),
		limit = 20, //items per page
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

	news.find({},{},function(err, allNews){
		if (err) throw err;
		if (allNews) {
			totalNews = allNews.length;
			pageCount = Math.ceil(totalNews / limit);

			var options = {
				"limit": limit,
				"skip": limit*(page-1),
				"sort": sort
			};

			news.find({},options,function(err, news){
				if (err) throw err;
				res.render('news', res.locals.template_data = {
					layout: 'main',
					active: { news: true },
					meta_title: 'Новости и события',
					meta_total_books: totalNews,
					pagination: {
						page: page,
						pageCount: pageCount
					},
					news: news
				});
			});

		} else {
			console.log("error")
		}
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
