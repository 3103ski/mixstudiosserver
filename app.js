var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Router Imports
// var indexRouter = require('./routes/index');

const userProfileRouter = require('./routes/userProfileRouter');
const soundsLikeObjectsRouter = require('./routes/soundsLikeObjectsRouter');
const serviceProfilesRouter = require('./routes/serviceProfileRouter/serviceProfilesRouter');
const instrumentProfilesRouter = require('./routes/instrumentsRouter/instrumentRouter');
const servicesPricingRouter = require('./routes/servicePricingProfilesRouter/servicePricingProfilesRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/mixstudios';
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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
// app.use('/', indexRouter);
app.use('/users', userProfileRouter);
app.use('/sounds-like', soundsLikeObjectsRouter);
app.use('/service-profiles', serviceProfilesRouter);
app.use('/service-pricing', servicesPricingRouter);
app.use('/instruments', instrumentProfilesRouter);

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
