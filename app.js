// Middleware
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const config = require('./config');

// Router Imports
// const indexRouter = require('./routes/index');
const portfolioRouter = require('./routes/portfoliosRouter/portfolioEntriesRouter');
const uploadsRouter = require('./routes/uploadRouter');
const userProfileRouter = require('./routes/userProfileRouter');
const soundsLikeObjectsRouter = require('./routes/soundsLikeObjectsRouter');
const serviceProfilesRouter = require('./routes/serviceProfileRouter/serviceProfilesRouter');
const instrumentProfilesRouter = require('./routes/instrumentsRouter/instrumentRouter');
const servicesPricingRouter = require('./routes/servicePricingProfilesRouter/servicePricingProfilesRouter');

// Connecting Database
const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connect.then(
	() => {
		console.log('Connected correctly to the server');
	},
	(err) => console.log(err)
);

// Initializing express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialize passport middleware
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/home', (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.use('/users', userProfileRouter);
app.use('/sounds-like', soundsLikeObjectsRouter);
app.use('/service-profiles', serviceProfilesRouter);
app.use('/service-pricing', servicesPricingRouter);
app.use('/instruments', instrumentProfilesRouter);
app.use('/uploads', uploadsRouter);
app.use('/portfolio', portfolioRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
