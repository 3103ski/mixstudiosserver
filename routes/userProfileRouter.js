const express = require('express');
const axios = require('axios');
const auth = require('../authenticate');
const cors = require('./cors');
const SoundsLikeObject = require('../models/users/soundsLikeObject');
const UserProfile = require('../models/users/userProfile');
const passport = require('passport');
const config = require('../config');
const path = require('path');

const userProfileRouter = express.Router();

userProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		console.log('Applied browse filters', req.query.filters);

		const filters = req.query.filters !== undefined ? JSON.parse(req.query.filters) : null;
		UserProfile.find(filters)
			.then((profiles) => {
				const page = req.query.page ? parseInt(req.query.page) : 1;
				const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
				const startIndex = page * limit;
				const endIndex =
					startIndex + limit < profiles.length - 1 ? profiles.length : startIndex + limit;
				const returnList = profiles.slice(startIndex, startIndex + limit);
				console.log('I return', returnList);
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json({
					list: profiles,
					profileCount: profiles.length,
				});
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
	.options(cors.cors, (req, res) => res.sendStatus(200))
	.post(cors.cors, (req, res, next) => {
		UserProfile.register(
			new UserProfile({ username: req.body.username, userInfo: req.body.userInfo }),
			req.body.password,
			(err, user) => {
				console.log('in there');
				if (err) {
					console.log('it broke early: ', err);
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

userProfileRouter
	.route('/spotify/token')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, (req, res, next) => {
		if (req.body.token) {
			const bearer = `Bearer ${req.body.token}`;
			axios
				.get('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: bearer,
					},
				})
				.then((spotifyResponse) => {
					const profile = spotifyResponse.data;
					UserProfile.findOne({ spotifyId: profile.id }, (err, user) => {
						if (err) {
							res.statusCode = 500;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								success: false,
								status: 'There was an error',
								errorMsg: err,
							});
						}
						if (!err && user) {
							const token = auth.getToken({ _id: user._id });
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								success: true,
								token: token,
								status: 'You are successfully logged in!',
								user: user,
							});
						} else {
							let user = new UserProfile({ username: profile.display_name });
							const name = profile.display_name.split(' ');

							user.spotifyId = profile.id;
							user.userInfo.firstName = name[0] ? name[0] : `${profile.display_name}`;
							user.userInfo.lastName = name[1] ? name[1] : '';
							user.userInfo.email = profile.email;

							if (profile.images[0] && profile.images[0].url) {
								user.userInfo.spotifyAvatar = profile.images[0].url;
							}

							user.save((err) => {
								if (err) {
									res.statusCode = 409;
									res.setHeader('Content-Type', 'application/json');
									res.json({
										success: false,
										status: 'There was an error or conflict saving the profile',
										errorMsg: err,
									});
								} else {
									const token = auth.getToken({ _id: user._id });
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json({
										success: true,
										token: token,
										status: 'You are successfully logged in!',
										user: user,
									});
								}
							});
						}
					});
				})
				.catch((err) => next(err));
		}
	});

userProfileRouter
	.route('/facebook/token')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, passport.authenticate('facebook-token'), (req, res) => {
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

userProfileRouter
	.route('/google/token')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, passport.authenticate('google-token'), (req, res) => {
		const token = auth.getToken({ _id: req.user._id });
		console.log('Ready to send back this user: ', req.user);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			success: true,
			token: token,
			status: 'You are successfully logged in!',
			user: req.user,
		});
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
				// SoundsLikeObject.find({ userId: req.user._id }).then((soundsLikeList) => {
				// 	user.styleInfo.soundsLike = soundsLikeList;
				// });
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
	.get(cors.cors, (req, res, next) => {
		const userId = req.params.userId;
		UserProfile.findById(userId)
			.then((userProfile) => {
				// SLOs here is just listing names as strings in an array for UI usage.
				// For details on one or a group of SLOs, you shoulds make a seperate call to the db and not
				// depend on '[profile].styleInfo.soundsLike' for other SLO info.
				SoundsLikeObject.find({ userId: userId })
					.then((SLOs) => {
						const soundsLikeNames = SLOs.map((slo) => slo.title);
						userProfile.soundsLike = soundsLikeNames;
						const returnProfile = {
							...userProfile._doc,
							soundsLike: soundsLikeNames,
						};
						// userProfile.save();
						console.log(returnProfile);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(returnProfile);
					})
					.catch((err) => next(err));
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
