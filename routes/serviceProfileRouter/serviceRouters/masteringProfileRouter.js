const express = require('express');

const MasteringProfile = require('../../../models/serviceProfiles/masteringServiceProfile');

const masteringProfileRouter = express.Router();

masteringProfileRouter
	.route('/')
	.get((req, res, next) => {
		MasteringProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		MasteringProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/data');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res) => {
		MasteringProfile.deleteMany().then((response) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/data');
			res.json(response);
		});
	})
	.put((req, res) => {
		res.end('You cannot PUT at this endpoint.');
	});

masteringProfileRouter
	.route('/:userId')
	.get((req, res, next) => {
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
	.delete((req, res, next) => {
		let profile;
		const id = req.params.userId;

		MasteringProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					profile = profiles[0];
					MasteringProfile.findByIdAndDelete(profile._id)
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
	.put((req, res, next) => {
		let profile;
		const id = req.params.userId;

		MasteringProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					profile = profiles[0];
					MasteringProfile.findByIdAndUpdate(profile._id, { $set: req.body }, { new: true })
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
