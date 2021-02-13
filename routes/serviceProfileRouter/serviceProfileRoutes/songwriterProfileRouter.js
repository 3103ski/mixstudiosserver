const express = require('express');
const SongwriterServiceProfile = require('../../../models/serviceProfiles/songwriterServiceProfile');
const cors = require('../../cors');
const auth = require('../../../authenticate');

const songwriterProfileRouter = express.Router();

songwriterProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		SongwriterServiceProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		SongwriterServiceProfile.find({ userId: req.body.userId })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.body.userId} already has a songwriter service profile`);
				} else {
					const newprofile = req.body;
					newprofile.userId = req.user._id;
					return SongwriterServiceProfile.create(req.body);
				}
			})
			.then((songwriterProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(songwriterProfile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		SongwriterServiceProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		SongwriterServiceProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					SongwriterServiceProfile.findByIdAndUpdate(
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

songwriterProfileRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		SongwriterServiceProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					const profile = profiles[0];
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(profile);
				} else {
					res.statusCode = 404;
					res.end(`There was no songwriter profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		SongwriterServiceProfile.find({ userId: id })
			.then((profiles) => {
				if ((profiles[0] && id === req.user._id) || req.user.isAdmin) {
					SongwriterServiceProfile.findByIdAndDelete(profiles[0]._id)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no songwriter profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		SongwriterServiceProfile.find({ userId: id })
			.then((profiles) => {
				if ((profiles[0] && id === req.user._id) || req.user.isAdmin) {
					SongwriterServiceProfile.findByIdAndUpdate(
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
					res.end(`There was no songwriter profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

module.exports = songwriterProfileRouter;
