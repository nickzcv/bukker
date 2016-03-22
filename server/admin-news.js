var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path'),
	bodyparser = require('body-parser'),
	getSlug = require('speakingurl'),
	multer = require('multer'),
	request = require('request'),
	mime = require('mime'),
	upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'news');
			},
			filename: function (req, file, cb) {
				cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
			}
		})
	});

/* admin page */
router.get('/admin/news', function (req, res) {
	var db = req.db,
		news = db.get('news'),
		limit = 10, //books per page
		totalNews = 0,
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
				res.render('admin-news', res.locals.template_data = {
					layout: 'admin',
					active: { news: true },
					meta_title: 'Новости ('+totalNews+'шт.)',
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

router.get('/admin/addnews', function (req, res) {
	res.render('admin-addnews', res.locals.template_data = {
		layout: 'admin',
		active: { news: true },
		meta_title: 'Добавление новости'
	});
});

router.use(bodyparser.urlencoded({
	extended: false
}));

/* Adding news to DB */
router.post('/admin/addnews', upload.single('newsImage'), function(req, res) {
	var db = req.db,
		news = db.get('news'),
	//save form data
		hot = req.body.hot || false,
		title = req.body.title,
		content = req.body.newsContent,
		tags = req.body.tags.split(','),
		url = getSlug(title),
		image = false,
		arr=[],
		obj={};
console.log(tags);
	for (var i = 0; i < tags.length; i++) {
		obj.title = tags[i].trim();
		obj.url = getSlug( tags[i] );
		arr.push(obj);
		obj={};
	}

	if(req.file){
		image = req.file.filename
	}

	news.findOne({
		"url": url
	}, function (err, newsForCheck) {
		if (err) res.json(err);
		if (newsForCheck) {
			res.redirect(req.get('referer')+'#exist');
		} else {
			//start insert news to database
			news.insert({
				'hot' : hot,
				'title' : title,
				'content' : content,
				'tags': arr,
				'date': new Date(),
				'image' : image,
				'url' : url
			}, function (error, curent) {
				if (error) {
					res.redirect(req.get('referer')+'#eroor');
				} else {
					res.location('/admin/news');
					res.redirect('/admin/news');
				}
			});

		}
	});

});


module.exports = router;
