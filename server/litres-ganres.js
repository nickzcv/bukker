var express    = require('express'),
	router     = express.Router(),
	getSlug = require('speakingurl'),
	request = require('request'),
	cheerio = require('cheerio');

// litres  parser
router.get('/litres-ganres', function (req, res) {
	var db = req.db,
		ganres = db.get('ganres');

	url = 'http://www.litres.ru/zhanry/';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var ganre = {
				title:"",
				url:"",
				subGanres:{}
			};


			$('#genres_tree > li').each(function(i, elem) {
				ganre.title = $(this).find('.title').text();
				ganre.url = getSlug( ganre.title );

				var subGanres = {};
				$(this).find("ul > li").each(function(i, elem) {
					var slug = getSlug( $(this).text() );
					subGanres[slug] = $(this).text();
				});
				ganre.subGanres = subGanres;
				// adding to DB
				ganres.insert({
					'title' : ganre.title,
					'url' : ganre.url,
					'subGanres' : ganre.subGanres

				}, function (error, curent) {
					if (error) {
						res.redirect(req.get('referer')+'#eroor');
					} else {
						//res.location('/');
						//res.redirect('/');
						console.log(ganre.title);
					}

				});//end insert to database
			});


		}
	})
});

//litres popular books parser
router.get('/urls/:page', function (req, res, next) {
	var db = req.db,
		litres = db.get('litres');

	var page = req.params.page;
	var url = 'http://www.litres.ru/luchshie-knigi/page-'+page+'/?limit=240';

	console.log(url);

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var book = {
				url:""
			};

			$('#master_page_div>div:nth-child(3)>div').each(function(i, elem) {
				book.url = $(this).find('.booktitle div a').attr('href');

				litres.insert({
					'url' : book.url

				}, function (error, curent) {
					if (error) {
						console.log('error');
					} else {
						//res.location('/');
						//res.redirect('/');
						//console.log(book.url);
					}

				});//end insert to database
			});

			console.log("Done.")


		}
	});

	next();



});
router.get('/url-list', function(req, res) {
	var db = req.db,
		litres = db.get('litres');

	litres.find({},{},function(err, litres){
		if (err) throw err;
		if (litres) {
			res.render('urls', res.locals.template_data = {
				layout: 'main',
				meta_title: 'urls',
				litres: litres
			});
		}

	});
});

module.exports = router;
