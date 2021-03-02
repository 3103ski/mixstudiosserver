const express = require('express');
const InstrumentProfile = require('../../../models/serviceProfiles/instrumentProfile');
const cors = require('../../cors');
const auth = require('../../../authenticate');

const instrumentProfilesRouter = express.Router();

instrumentProfilesRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		InstrumentProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		// make sure user doesn't already have this instrument
		InstrumentProfile.find({ userId: req.user._id, name: req.body.name }).then((profiles) => {
			if (!profiles[0]) {
				InstrumentProfile.create(req.body)
					.then((profile) => {
						profile.userId = req.user._id;
						profile.save();
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(profile);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 304;
				res.setHeader('Content-Type', 'application/json');
				res.json({ errorMsg: 'this instrument already exists for this user.' });
			}
		});
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		InstrumentProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT not supported at this endpoint');
	});

instrumentProfilesRouter
	.route('/fetch-user-instruments')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		InstrumentProfile.find({ userId: req.user._id })
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	});

instrumentProfilesRouter
	.route('/user-collection/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.userId;
		InstrumentProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 200;
					res.setHeader('Content-Header', 'application/json');
					res.json(profiles);
				} else {
					res.statusCode = 404;
					res.end(`There was no instrument profiles found for user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		if (req.user._id === id) {
			InstrumentProfile.deleteMany({ userId: id })
				.then((response) => {
					res.statusCode = 200;
					res.setHeader('Content-Header', 'appplication/json');
					res.json(response);
				})
				.catch((err) => next(err));
		}
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT not supported at this endpoint');
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST not supported at this endpoint');
	});

instrumentProfilesRouter
	.route('/:profileId')
	.options(cors.cors, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, (req, res, next) => {
		const id = req.params.profileId;
		InstrumentProfile.findById(id)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'appplication/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.profileId;
		InstrumentProfile.findById(id)
			.then((profile) => {
				if (req.user._id.equals(profile.userId)) {
					InstrumentProfile.findByIdAndDelete(id)
						.then((res) => {
							return InstrumentProfile.find({ userId: req.user._id });
						})
						.then((remainingProfiles) => {
							res.statusCode = 200;
							res.setHeader('Content-Header', 'appplication/json');
							res.json(remainingProfiles);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 200;
					res.setHeader('Content-Header', 'appplication/json');
					res.end('this profile does not belong to this user');
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.profileId;
		InstrumentProfile.findById(id)
			.then((profile) => {
				if (req.user._id.equals(profile.userId)) {
					InstrumentProfile.findByIdAndUpdate(id, { $set: req.body }, { new: true })
						.then((res) => {
							return InstrumentProfile.find({ userId: req.user._id });
						})
						.then((profiles) => {
							res.statusCode = 200;
							res.setHeader('Content-Header', 'appplication/json');
							res.json(profiles);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 200;
					res.setHeader('Content-Header', 'appplication/json');
					res.end('this profile does not belong to this user');
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 401;
		res.end('POST not supported at this endpoint');
	});

module.exports = instrumentProfilesRouter;
