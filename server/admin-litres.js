var express    = require('express'),
	router     = express.Router(),
	getSlug = require('speakingurl'),
	request = require('request'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	path = require('path'),
	cheerio = require('cheerio');

/* litres page */
router.get('/admin/litres', function (req, res) {
	res.render('admin-litres', res.locals.template_data = {
		layout: 'admin',
		meta_title: 'Добавление книги из Litres'
	});
});


router.use(bodyparser.urlencoded({
	extended: false
}));

// litres URL parser
router.post('/admin/litres', function (req, res) {
	var db = req.db,
		books = db.get('books');

	var url =  req.body.url;
	//url = 'http://www.litres.ru/artem-kamenistyy/chuzhih-gor-plenniki/';

	//function to download cover
	var download = function(uri, filename, callback){
		request.head(uri, function(err, res, body){
			//console.log('content-type:', res.headers['content-type']);
			//console.log('content-length:', res.headers['content-length']);
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var litresRefID = "156223639"; //unused

			var book = {
				title:"",
				description:"",
				year:"",
				authors:{},
				ganres:{},
				tags:{},
				ratings:{},
				date:"",
				cover:"",
				litresid:"",
				url:""
			};

			book.title = $('#main-div .book-title').text();

			var str = $('#main-div .book_annotation').text();
			book.description = str;//str.substring(0, str.length-112);

			book.year = $('#main-div dd[itemprop=datePublished]').text();

			var obj={}; //temp object
			//authors get
			var authors = [];
			$('#main-div .book-author a').each(function(i, elem) {
				obj.name = $(this).text();
				obj.url = getSlug( $(this).text() );
				authors.push(obj);
				obj={};
			});
			book.authors = authors;

			//ganres get
			var ganres = [];
			$('#main-div dd a[itemprop=genre]').each(function(i, elem) {
				obj.title = $(this).text();
				obj.url = getSlug( $(this).text() );
				ganres.push(obj);
				obj={};
			});
			book.ganres = ganres;

			//tags get all
			var tags = [];
			$('#main-div dl dt').each(function(i, elem) {
				if( $(this).text() == "Теги:" ){
					var tagElement = $(this).next().children();
					$(tagElement).each(function(i, elem) {
						obj.title = $(this).text();
						obj.url = getSlug( $(this).text() );
						tags.push(obj);
						obj={};
					});
				}
			});
			book.tags = tags;

			//Rating get
			var ratings = [{
					"ratingTitle" : "ЛитРес",
					"ratingScale" : $('meta[itemprop=bestRating]').attr('content'),
					"ratingValue" : $('meta[itemprop=ratingValue]').attr('content'),
					"ratingCount" : $('meta[itemprop=ratingCount]').attr('content')
				}];

			book.ratings = ratings;

			var newName = "default.png";
			if( $('#main-div .bookpage-cover img:nth-child(2)').attr("src") ){
				var cover = $('#main-div .bookpage-cover img:nth-child(2)').attr("src");
				newName = 'cover-' + Date.now() + path.extname(cover);
			}
			book.cover = newName;

			var litresid = $('link[rel=shortlink]').attr("href");
			book.litresid = litresid.slice(22);

			book.url = getSlug(book.title);

			/* adding to DB */
			books.findOne({
				"url": book.url
			}, function (err, bookForCheck) {
				if (err) res.json(err);
				if (bookForCheck) {
					res.redirect(req.get('referer')+'#exist');
				} else {
					//start insert book to database
					books.insert({
						'title' : book.title,
						'description' : book.description,
						'year': parseInt(book.year),
						'authors' : book.authors,
						'ganres': book.ganres,
						'tags': book.tags,
						'ratings': book.ratings,
						'date': new Date(),
						'cover' : book.cover,
						'litresid' : book.litresid,
						'url' : book.url
					}, function (error, curent) {
						if (error) {
							res.redirect(req.get('referer')+'#eroor');
						} else {
							if( newName == "default.png" ){
								res.location('/admin/litres');
								res.redirect('/admin/litres');
							} else {
								download('http:'+cover, 'covers/'+newName, function(){
									res.location('/admin/litres');
									res.redirect('/admin/litres');
								});
							}
						}

					});//end insert book to database
				}
			});


		}
	})
});

// litres URL parser
router.post('/admin/litres-scope', function (req, res, next) {
	var db = req.db,
		books = db.get('books');

	var urls =  req.body.url.split('\n');
	//var urls = ['http://www.litres.ru/artur-konan-doyl-3/chelovek-s-rassechennoy-guboy/','http://www.litres.ru/artur-konan-doyl-3/mednye-buki-124225/'];

	//function to download cover
	var download = function(uri, filename, callback){
		request.head(uri, function(err, res, body){
			//console.log('content-type:', res.headers['content-type']);
			//console.log('content-length:', res.headers['content-length']);
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	for (i = 0; i < urls.length; i++) {

	console.log(urls[i]);
	request(urls[i], function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var litresRefID = "156223639"; //unused

			var book = {
				title:"",
				description:"",
				year:"",
				authors:{},
				ganres:{},
				tags:{},
				ratings:{},
				date:"",
				cover:"",
				litresid:"",
				url:""
			};

			book.title = $('#main-div .book-title').text();

			var str = $('#main-div .book_annotation').text();
			book.description = str;//str.substring(0, str.length-112);

			book.year = $('#main-div dd[itemprop=datePublished]').text();

			var obj={}; //temp object
			//authors get
			var authors = [];
			$('#main-div .book-author a').each(function(i, elem) {
				obj.name = $(this).text();
				obj.url = getSlug( $(this).text() );
				authors.push(obj);
				obj={};
			});
			book.authors = authors;

			//ganres get
			var ganres = [];
			$('#main-div dd a[itemprop=genre]').each(function(i, elem) {
				obj.title = $(this).text();
				obj.url = getSlug( $(this).text() );
				ganres.push(obj);
				obj={};
			});
			book.ganres = ganres;

			//tags get all
			var tags = [];
			$('#main-div dl dt').each(function(i, elem) {
				if( $(this).text() == "Теги:" ){
					var tagElement = $(this).next().children();
					$(tagElement).each(function(i, elem) {
						obj.title = $(this).text();
						obj.url = getSlug( $(this).text() );
						tags.push(obj);
						obj={};
					});
				}
			});
			book.tags = tags;

			//Rating get
			var ratings = [{
				"ratingTitle" : "ЛитРес",
				"ratingScale" : $('meta[itemprop=bestRating]').attr('content'),
				"ratingValue" : $('meta[itemprop=ratingValue]').attr('content'),
				"ratingCount" : $('meta[itemprop=ratingCount]').attr('content')
			}];

			book.ratings = ratings;

			var newName = "default.png";
			if( $('#main-div .bookpage-cover img:nth-child(2)').attr("src") ){
				var cover = $('#main-div .bookpage-cover img:nth-child(2)').attr("src");
				newName = 'cover-' + Date.now() + path.extname(cover);
			}
			book.cover = newName;

			var litresid = $('link[rel=shortlink]').attr("href");
			book.litresid = litresid.slice(22);

			book.url = getSlug(book.title);

			/* adding to DB */
			books.findOne({
				"url": book.url
			}, function (err, bookForCheck) {
				if (err) res.json(err);
				if (bookForCheck) {
					//res.redirect(req.get('referer')+'#exist');
				} else {
					//start insert book to database
					books.insert({
						'title' : book.title,
						'description' : book.description,
						'year': parseInt(book.year),
						'authors' : book.authors,
						'ganres': book.ganres,
						'tags': book.tags,
						'ratings': book.ratings,
						'date': new Date(),
						'cover' : book.cover,
						'litresid' : book.litresid,
						'url' : book.url
					}, function (error, curent) {
						if (error) {
							res.redirect(req.get('referer')+'#eroor');
						} else {
							if( newName == "default.png" ){
								res.location('/admin/litres');
								res.redirect('/admin/litres');
							} else {
								download('http:'+cover, 'covers/'+newName, function(){
									//res.location('/admin/litres');
									//res.redirect('/admin/litres');
								});
							}
						}

					});//end insert book to database
				}
			});


		}
	})
	}

});


module.exports = router;
