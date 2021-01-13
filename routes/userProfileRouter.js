const express = require('express');
const UserProfile = require('../models/users/userProfile');
const SoundsLikeObject = require('../models/users/soundsLikeObject');

const userProfileRouter = express.Router();

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
		res.end('POST is not supported at this endpoint');
	});

module.exports = userProfileRouter;
