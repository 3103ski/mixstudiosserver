const express = require('express');
const MixingProfile = require('../../../models/serviceProfiles/mixingServiceProfile');

const cors = require('../../cors');
const auth = require('../../../authenticate');

const mixingProfileRouter = express.Router();

mixingProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		MixingProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		MixingProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.body.userId} already has a mixing service profile`);
				} else {
					const newProfile = req.body;
					newProfile.userId = req.user._id;
					return MixingProfile.create(newProfile);
				}
			})
			.then((mixingProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(mixingProfile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		MixingProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		MixingProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					MixingProfile.findByIdAndUpdate(
						profiles[0]._id,
						{ $set: req.body },
						{ new: true }
					)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no mixing profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	});

mixingProfileRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.userId;
		MixingProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					const profile = profiles[0];
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(profile);
				} else {
					res.statusCode = 404;
					res.end(`There was no mixing profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		const id = req.params.userId;

		MixingProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					MixingProfile.findByIdAndDelete(profiles[0]._id)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no mixing profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		MixingProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					MixingProfile.findByIdAndUpdate(
						profiles[0]._id,
						{ $set: req.body },
						{ new: true }
					)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no mixing profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

module.exports = mixingProfileRouter;
