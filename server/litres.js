var express    = require('express'),
	router     = express.Router(),
	getSlug = require('speakingurl'),
	request = require('request'),
	bodyparser = require('body-parser'),
	fs = require('fs'),
	basic_auth = require('basic-auth'),
	path = require('path'),
	cheerio = require('cheerio');

/* litres page */
router.get('/litres', function (req, res) {
	var user = basic_auth(req);
	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name != 'nick' && user.pass != 'nick')
		return req.app.locals.unauthorized(res);

	res.render('litres', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Добавление книги из Litres'
	});
});


router.use(bodyparser.urlencoded({
	extended: false
}));

// litres URL parser
router.post('/litres', function (req, res) {
	var db = req.db,
		books = db.get('books');

	url =  req.body.url;
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
			var litresRefID = "156223639";

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

			//authors get all
			var authors = {};
			$('#main-div .book-author a').each(function(i, elem) {
				var author_slug = getSlug( $(this).text() );
				authors[author_slug] = $(this).text();
			});
			book.authors = authors;

			//ganres get all
			var ganres = {};
			$('#main-div dd a[itemprop=genre]').each(function(i, elem) {
				var ganre_slug = getSlug( $(this).text() );
				ganres[ganre_slug] = $(this).text();
			});
			book.ganres = ganres;

			//tags get all
			var tags = {};
			$('#main-div dl dt').each(function(i, elem) {
				if( $(this).text() == "Теги:" ){
					var tagElement = $(this).next().children();
					$(tagElement).each(function(i, elem) {
						tag_slug = getSlug( $(this).text() );
						tags[tag_slug] = $(this).text();
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
			book.litresid = litresid.slice(21);

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
								res.location('/');
								res.redirect('/');
							} else {
								download(cover, 'covers/'+newName, function(){
									res.location('/');
									res.redirect('/');
								});
							}
						}

					});//end insert book to database
				}
			});


		}
	})
});


module.exports = router;
