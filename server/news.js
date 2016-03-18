var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* news page */
router.get('/news', function (req, res) {

	res.render('news', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Новости',
		active: { news: true }
	});


});

module.exports = router;
