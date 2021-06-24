const express = require('express');
const axios = require('axios');
const auth = require('../authenticate');
const cors = require('./cors');
const passport = require('passport');

const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const FileType = require('file-type');

const SoundsLikeObject = require('../models/users/soundsLikeObject');
const UserProfile = require('../models/users/userProfile');

const userProfileRouter = express.Router();

// Amazon s3 for avatar bucket

AWS.config.update({
	accessKeyId: 'AKIARRLEMNTVQBYT73P7',
	secretAccessKey: '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',
});

const s3 = new AWS.S3();

const uploadAvatar = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-avatars',
		Key: `${name}`,
	};

	return s3.upload(params).promise();
};

userProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const filters = req.query.filters !== undefined ? JSON.parse(req.query.filters) : null;
		UserProfile.find(filters)
			.then((profiles) => {
				const page = req.query.page ? parseInt(req.query.page) : 1;
				const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
				const startIndex = page * limit;
				const endIndex =
					startIndex + limit < profiles.length - 1 ? profiles.length : startIndex + limit;
				const returnList = profiles.slice(startIndex, startIndex + limit);
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
					UserProfile.findOne({ spotifyId: profile.id }, async (err, user) => {
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
								const avatarUrl = profile.images[0].url;
								const avatarResponse = await fetch(avatarUrl);
								const avatarBuffer = await avatarResponse.buffer();
								const type = await FileType.fromBuffer(avatarBuffer);
								uploadAvatar(avatarBuffer, user._id.toString(), type)
									.then((s3Res) => {
										user.userInfo.avatar = s3Res.Location;
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
									})
									.catch((err) => {
										res.statusCode = 409;
										res.setHeader('Content-Type', 'application/json');
										res.json({
											success: false,
											status: 'There was an error or conflict saving the profile',
											errorMsg: err,
										});
									});
							} else {
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
	.route('/follow-user')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		console.log(req.user._id.toString(), ' will START following: ', req.body.idToFollow);

		UserProfile.findOne({ _id: req.user._id.toString() })
			.then((user) => {
				console.log('we found the user: ', user);
				if (req.body.idToFollow) {
					user.following.push(req.body.idToFollow);
					user.save();

					console.log('We should be sending this back: ', user.following);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(user.following);
				} else {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({ errorMsg: 'Server not given any id to follow.' });
				}
			})
			.catch((error) => {
				console.log('Our INTERNAL server error: ', error);
				next(error);
			});
	});

userProfileRouter
	.route('/unfollow-user')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		console.log('SERVER HEARD TO FOLLOW FOR ', req.user._id);
		UserProfile.findOne({ _id: req.user._id })
			.then((user) => {
				if (user && req.body.idToFollow) {
					let updatedFollowing = user.following
						.map((id) => {
							console.log('comparing ', id, ' to ', req.body.idToFollow);
							if (id === req.body.idToFollow) {
								console.log('MATCH');
								return null;
							} else {
								console.log('KEEP IT');
								return id;
							}
						})
						.filter((id) => id !== null);
					user.following = updatedFollowing;
					user.save();

					console.log('this should be the updated user following: ', user.following);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(user.following);
				} else {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({ errorMsg: 'Server not given any id to stop following.' });
				}
			})
			.catch((error) => next(error));
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
						// console.log(returnProfile);
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
