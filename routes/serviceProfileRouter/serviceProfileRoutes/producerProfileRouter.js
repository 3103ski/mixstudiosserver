const express = require('express');
const cors = require('../../cors');
const auth = require('../../../authenticate');
const ProducerProfile = require('../../../models/serviceProfiles/producerServiceProfile');
const UserProfile = require('../../../models/users/userProfile');

const producerProfilesRouter = express.Router();

producerProfilesRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		ProducerProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		ProducerProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.user._id} already has a producer service profile`);
				} else {
					const newprofile = req.body;
					newprofile.userId = req.user._id;
					return ProducerProfile.create(newprofile);
				}
			})
			.then((producerProfile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(producerProfile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		ProducerProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		ProducerProfile.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					ProducerProfile.findByIdAndUpdate(
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

producerProfilesRouter
	.route('/:userId')
	.get((req, res, next) => {
		const id = req.params.userId;
		ProducerProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					const profile = profiles[0];
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(profile);
				} else {
					res.statusCode = 404;
					res.end(`There was no producer profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		const id = req.params.userId;

		ProducerProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					ProducerProfile.findByIdAndDelete(profiles[0]._id)
						.then((response) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(response);
						})
						.catch((err) => next(err));
				} else {
					res.statusCode = 404;
					res.end(`There was no producer profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		const id = req.params.userId;

		ProducerProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					ProducerProfile.findByIdAndUpdate(
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
					res.end(`There was no producer profile for the user id ${id}`);
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

module.exports = producerProfilesRouter;
