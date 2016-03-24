var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* Catalog */
router.get('/catalog', function (req, res) {

	res.render('catalog', res.locals.template_data = {
		layout: 'main',
		active: { catalog: true },
		meta_title: 'Каталог книжных сайтов'
	});

});


router.get('/catalog/:url', function(req, res, next) {
	next();
});

module.exports = router;
