// Middleware
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const config = require('./config');
const cors = require('./routes/cors.js');

// Router Imports
const portfolioRouter = require('./routes/s3Storage/portfolioEntries');
const avatarUploadRouter = require('./routes/s3Storage/userAvatars');
const userProfileRouter = require('./routes/userProfileRouter');

const serviceProfilesRouter = require('./routes/serviceProfileRouter/serviceProfilesRouter');

const servicesPricingRouter = require('./routes/servicePricingProfilesRouter/servicePricingProfilesRouter');

const bugReportRouter = require('./routes/utilityFormsRouter/bugReportRouter');
const updateReportRouter = require('./routes/utilityFormsRouter/updateReportRouter');

const activityRouter = require('./routes/feedsRoutes/activityFeedRouter');
const studioFeedRouter = require('./routes/feedsRoutes/studioFeedRouter');

const userPicUploadRouter = require('./routes/s3Storage/userPics');

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
		console.log('MongoDB Connected');
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
app.use(express.static(path.join(__dirname, 'views')));

// ROUTES
app.get('/', cors.cors, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(express.static(path.join(__dirname, 'views/index.html')));
});

app.use('/activity', activityRouter);
app.use('/studio-feed', studioFeedRouter);

app.use('/users', userProfileRouter);
app.use('/service-profiles', serviceProfilesRouter);
app.use('/service-pricing', servicesPricingRouter);

app.use('/portfolio', portfolioRouter);
app.use('/bug-reports', bugReportRouter);
app.use('/update-report', updateReportRouter);

app.use('/avatars', avatarUploadRouter);

app.use('/user-pics', userPicUploadRouter);

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

console.log('how app sees env:: ', process.env.AWS_SECRET_ACCESS_KEY);
module.exports = app;
