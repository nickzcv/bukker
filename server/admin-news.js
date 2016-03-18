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
				cb(null, 'covers');
			},
			filename: function (req, file, cb) {
				cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
			}
		})
	});

/* admin page */
router.get('/admin/news', function (req, res) {

	res.render('admin-news', res.locals.template_data = {
		layout: 'admin',
		meta_title: 'Новости',
		active: { news: true }
	});

});

router.get('/admin/addnews', function (req, res) {
	res.render('admin-addnews', res.locals.template_data = {
		layout: 'admin',
		meta_title: 'Добавление книги в Буккер'
	});
});


module.exports = router;
