var express    = require('express'),
	router     = express.Router(),
	fs = require('fs'),
	path = require('path');

/* admin page */
router.get('/news', function (req, res) {

	res.render('news', res.locals.template_data = {
		layout: 'main',
		meta_title: 'Новости',
		active: { news: true }
	});


});

module.exports = router;
