const express = require('express');
const UserProfile = require('../models/users/userProfile');
const SoundsLikeObject = require('../models/users/soundsLikeObject');
const cors = require('./cors');
const passport = require('passport');
const auth = require('../authenticate');

const userProfileRouter = express.Router();

userProfileRouter.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200));

userProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		UserProfile.find()
			.then((userProfiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(userProfiles);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		UserProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoint');
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoint');
	});

userProfileRouter
	.route('/signup')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, (req, res) => {
		UserProfile.register(
			new UserProfile({ username: req.body.username, userInfo: req.body.userInfo }),
			req.body.password,
			(err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({ err: err });
				} else {
					user.save((err) => {
						if (err) {
							res.statusCode = 500;
							res.setHeader('Content-Type', 'application/json');
							res.json({ err: err });
							return;
						}
						passport.authenticate('local')(req, res, () => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								success: true,
								status: 'Registration Successful!',
								user: user,
							});
						});
					});
				}
			}
		);
	});

userProfileRouter.post('/login', cors.cors, passport.authenticate('local'), (req, res) => {
	const token = auth.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		token: token,
		status: 'You are successfully logged in!',
		user: req.user,
	});
});

// 'fetch-user' endpoint used by front-end to easily grab data of the currently authenticated user. '/:userId' endpoint is for any
// account or instance of the app to get info on any user; given they have the permissions
userProfileRouter
	.route('/fetch-user')
	.options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res) => {
		UserProfile.findById(req.user._id)
			.then((user) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(user);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoing');
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoing');
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoing');
	});

userProfileRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
	.get((req, res, next) => {
		const userId = req.params.userId;
		UserProfile.findById(userId)
			.then((userProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				// SLOs here is just listing names as strings in an array for UI usage.
				// For details on one or a group of SLOs, you shoulds make a seperate call to the db and not
				// depend on '[profile].styleInfo.soundsLike' for other SLO info.
				SoundsLikeObject.find({ userId: userId }).then((SLOs) => {
					const soundsLikeNames = SLOs.map((slo) => slo.soundsLike);
					userProfile.styleInfo.soundsLike = soundsLikeNames;
					userProfile.save();
					res.json(userProfile);
				});
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		if (req.user._id.toString() === req.params.userId) {
			UserProfile.findByIdAndUpdate(
				req.params.userId,
				{
					$set: req.body,
				},
				{ new: true }
			)
				.then((userProfile) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(userProfile);
				})
				.catch((err) => next(err));
		} else {
			res.statusCode = 403;
			res.end('the authorized user is not the owner of this profile');
		}
	})
	.delete((req, res, next) => {
		UserProfile.findByIdAndDelete(req.params.userId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 403;
		res.end('Method not supported at this endpoint');
	});

module.exports = userProfileRouter;