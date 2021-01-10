const express = require('express');
const UserProfile = require('../models/users/userProfile');
const SoundsLikeObject = require('../models/users/soundsLikeObject');

const userProfileRouter = express.Router();

//_________________________
//	ALL USER DOCS
//-------------------------
userProfileRouter
	.route('/')
	.get((req, res, next) => {
		UserProfile.find()
			.then((userProfiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(userProfiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		UserProfile.create(req.body)
			.then((profile) => {
				console.log('User Created: ', profile);
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		UserProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end('PUT not supported at this endpoint');
	});

userProfileRouter
	.route('/sounds-like')
	.post((req, res) => {
		res.end('You cannot POST to this endpoint');
	})
	.get((req, res, next) => {
		SoundsLikeObject.find()
			.then((slos) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(slos);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SoundsLikeObject.deleteMany()
			.then((respsone) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(respsone);
			})
			.catch((err) => next(err));
	});

// All SLOs not by user, but by artist users say they sound like. Artist name in endpoint should separate multiple words in name with '-'.
userProfileRouter.route('/sounds-like/:artist').get((req, res, next) => {
	let artist = req.params.artist.split('-');
	if (artist.length > 1) {
		artist = artist.join(' ').toLowerCase();
	} else {
		artist = artist[0].toLowerCase();
	}
	console.log(artist);

	SoundsLikeObject.find({ soundsLike: artist })
		.then((results) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(results);
		})
		.catch((err) => next(err));
});

//_________________________
//	SPECIFIC USER DOCS
//-------------------------

// Core Profiles
userProfileRouter
	.route('/:userId')
	.get((req, res, next) => {
		const userId = req.params.userId;
		UserProfile.findById(userId)
			.then((userProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				// SLOs here is just listing names as strings in an array for UI usage.
				// For details on one or a group of SLOs, you shoulds make a separate call to the db and not
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
		res.end('POST is not supported at this endpoint');
	});

// 'Sounds Like' Objects
userProfileRouter
	.route('/:userId/sounds-like/')
	.post((req, res, next) => {
		let slo = { ...req.body, userId: req.params.userId };
		slo.soundsLike = slo.soundsLike.toLowerCase();
		SoundsLikeObject.create(slo)
			.then((SLO) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLO);
			})
			.catch((err) => next(err));
	})
	.get((req, res, next) => {
		SoundsLikeObject.find({ userId: req.params.userId })
			.then((SLOs) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLOs);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SoundsLikeObject.deleteMany({ userId: req.params.userId })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.setHeader('Content-Type', 'application/json');
		res.end('PUT not supported at this endpoint');
	});

module.exports = userProfileRouter;
