const express = require('express');
const UserProfile = require('../models/users/userProfile');
const SoundsLikeObject = require('../models/users/soundsLikeObject');
const cors = require('./cors');
const passport = require('passport');
const auth = require('../authenticate');

const userProfileRouter = express.Router();

userProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
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
	.post((req, res) => {
		UserProfile.register(new UserProfile({ username: req.body.username, userInfo: req.body.userInfo }), req.body.password, (err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				if (req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if (req.body.lastname) {
					user.lastname = req.body.lastname;
				}
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
						res.json({ success: true, status: 'Registration Successful!' });
					});
				});
			}
		});
	});

userProfileRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
	const token = auth.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

userProfileRouter
	.route('/:userId')
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
	.put((req, res, next) => {
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
