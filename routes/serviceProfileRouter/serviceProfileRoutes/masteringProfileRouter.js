const express = require('express');
const MasteringProfile = require('../../../models/serviceProfiles/masteringServiceProfile');
const cors = require('../../cors');
const auth = require('../../../authenticate');

const masteringProfileRouter = express.Router();

masteringProfileRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		MasteringProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		MasteringProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.user._id} already has a mastering service profile`);
				} else {
					const newprofile = req.body;
					newprofile.userId = req.user._id;
					return MasteringProfile.create(req.body);
				}
			})
			.then((masteringProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(masteringProfile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res) => {
		MasteringProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		MasteringProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					MasteringProfile.findByIdAndUpdate(
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
					res.end(`There was no mastering profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	});

masteringProfileRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.userId;
		MasteringProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					const masteringProfile = profiles[0];
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(masteringProfile);
				} else {
					res.statusCode = 404;
					res.end(`There was no mastering profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		MasteringProfile.find({ userId: id })
			.then((profiles) => {
				if ((profiles[0] && id === req.user._id) || req.user.isAdmin) {
					MasteringProfile.findByIdAndDelete(profiles[0]._id)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no mastering profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;

		MasteringProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					MasteringProfile.findByIdAndUpdate(
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
					res.end(`There was no mastering profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.end('You cannot POST at this endpoint');
	});

module.exports = masteringProfileRouter;
