const express = require('express');
const StudioMusicianProfile = require('../../../models/serviceProfiles/studioMusicianServiceProfile');
const InstrumentProfile = require('../../../models/serviceProfiles/instrumentProfile');
const cors = require('../../cors');
const auth = require('../../../authenticate');

const studioMusicianProfileRouter = express.Router();

studioMusicianProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		StudioMusicianProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		StudioMusicianProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(
						`User ${req.body.userId} already has a studio musician service profile`
					);
				} else {
					const newprofile = req.body.profile;
					newprofile.userId = req.user._id;
					const instruments = req.body.instruments;
					for (let i = 0; i < instruments.length; i++) {
						InstrumentProfile.create(instruments[i])
							.then((instrument) => {
								instrument.userId = req.user._id;
								instrument.save();
							})
							.catch((err) => next(err));
					}
					return StudioMusicianProfile.create(newprofile);
				}
			})
			.then((studioMusicianProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(studioMusicianProfile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		StudioMusicianProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		StudioMusicianProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					StudioMusicianProfile.findByIdAndUpdate(
						profiles[0]._id,
						{ $set: req.body },
						{ new: true }
					)
						.then((updatedProfile) => {
							InstrumentProfile.find({ userId: req.user._id }).then((instruments) => {
								updatedProfile.instruments = instruments;
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(updatedProfile);
							});
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no mixing profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	});

studioMusicianProfileRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.userId;
		StudioMusicianProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					const profile = profiles[0];
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(profile);
				} else {
					res.statusCode = 404;
					res.end(`There was no studio musician profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		StudioMusicianProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if ((profiles[0] && req.user._id === id) || req.user.isAdmin) {
					StudioMusicianProfile.findByIdAndDelete(profiles[0]._id)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no studio musician profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		StudioMusicianProfile.find({ userId: id })
			.then((profiles) => {
				if ((profiles[0] && req.user._id === id) || req.user.isAdmin) {
					StudioMusicianProfile.findByIdAndUpdate(
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
					res.end(`There was no studio musician profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.post(cors.cors, (req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

module.exports = studioMusicianProfileRouter;
