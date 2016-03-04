var express = require('express'),
	exphbs = require('express-handlebars'),
	fs = require('fs'),
	winston = require('winston'),
	app = express(),
	basic_auth = require('basic-auth'),
	mongo = require('mongodb'),
	monk = require('monk'),
	db = monk('localhost:27017/bukker');

// Make our db accessible to our router
app.use(function(req,res,next){
	req.db = db;
	next();
});

// Set up a logger.
app.locals.logger = new winston.Logger();
app.locals.logger.add(winston.transports.Console, {
	colorize: true,
});

/*
app.locals.unauthorized = function (res) {
	res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
	return res.sendStatus(401);
};

app.use(function (req, res, next)  {
	if (req.hostname === 'localhost')
		return next();

	var user = basic_auth(req);

	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name === 'nick' && user.pass === 'nick')
		return next();

	return req.app.locals.unauthorized(res);
});
*/

// Serve static files.
app.use('/static', express.static('public'));
app.use('/static/css', express.static('css'));
app.use('/covers', express.static('covers'));
app.use('/static/bower_components', express.static('bower_components'));

// Log every request.
app.use(function (req, res, next) {
	req.app.locals.logger.info('[' + req.method + ']', req.url);
	next();
});

// Location for static content.
app.locals.static_root = '/static/';

// Initialise handleabars with helpers.
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
	helpers: {
		'static-root': function (data) {
			return '/static';
		},
		'main-root': function (data) {
			return '/';
		},
	},
}));

// Set 'template_data' variable that will be used with all template rendering.
app.use(function (req, res, next) {
	res.locals.template_data = {
		layout: 'main',
		meta_title: 'Bukker'
	};
	next();
});

// Display main site.
app.use(require('./site.js'));
app.use(require('./litres.js'));

// Handle 500 (internal server erorr).
app.use(function (error, req, res, next) {
	req.app.locals.logger.error(error);
	res.status(500).send('500: Internal Server Error');
});

// Handle 404 (page not found).
app.use(function (req, res) {
	res
		.status(404)
		.render('404', res.locals.template_data);
});

// Start web server.
app.locals.port = 80;

if (
	typeof process.env.PORT !== 'undefined' &&
	process.env.PORT !== ''
)
	app.locals.port = parseInt(process.env.PORT, 10);

app.listen(app.locals.port);
console.log('Listening on http://localhost:' + app.locals.port);
