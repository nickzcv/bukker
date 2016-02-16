var express = require('express'),
	exphbs = require('express-handlebars'),
	fs = require('fs'),
	winston = require('winston'),
	app = express(),
	basic_auth = require('basic-auth');

// Set up a logger.
app.locals.logger = new winston.Logger();
app.locals.logger.add(winston.transports.Console, {
	colorize: true,
});

app.locals.unauthorized = function (res) {
	res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
	return res.sendStatus(401);
};

app.use(function (req, res, next) {
	if (req.hostname === 'localhost')
		return next();

	var user = basic_auth(req);

	if (!user || !user.name || !user.pass)
		return req.app.locals.unauthorized(res);

	if (user.name === 'nick' && user.pass === 'nick')
		return next();

	return req.app.locals.unauthorized(res);
});

// Serve static files.
app.use('/', express.static('public'));
app.use('/static', express.static('public'));
app.use('/static/css', express.static('css'));
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
		each_nth: function (index_count, nth, block) {
			if (index_count === 0)
				return '';

			if (index_count % nth === 0)
				return block.fn(this);

			return '';
		},
		'static-root': function (data) {
			return '/static';
		},
	},
}));

// Set 'template_data' variable that will be used with all template rendering.
app.use(function (req, res, next) {
	res.locals.template_data = {
		layout: 'main',
		meta_title: 'Dizayn.by'
	};
	next();
});

// Display main site.
app.use(require('./site.js'));

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
app.locals.port = 3333;

if (
	typeof process.env.PORT !== 'undefined' &&
	process.env.PORT !== ''
)
	app.locals.port = parseInt(process.env.PORT, 10);

app.listen(app.locals.port);
console.log('Listening on http://localhost:' + app.locals.port);
