const express = require('express');
const SongwriterServiceProfile = require('../../../models/serviceProfiles/songwriterServiceProfile');
const UserProfile = require('../../../models/users/userProfile');
const songwriterProfileRouter = express.Router();

songwriterProfileRouter
	.route('/')
	.get((req, res, next) => {
		SongwriterServiceProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		SongwriterServiceProfile.find({ userId: req.body.userId })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.body.userId} already has a songwriter service profile`);
				} else {
					return SongwriterServiceProfile.create(req.body);
				}
			})
			.then((songwriterProfile) => {
				UserProfile.findById(songwriterProfile.userId).then((profile) => {
					profile.serviceProfiles.songwriter.profileId = songwriterProfile._id;
					profile.save();
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(songwriterProfile);
				});
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SongwriterServiceProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('You cannot PUT at this endpoint.');
	});

songwriterProfileRouter
	.route('/:userId')
	.get((req, res, next) => {
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
	.delete((req, res, next) => {
		const id = req.params.userId;
		SongwriterServiceProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
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
	.put((req, res, next) => {
		const id = req.params.userId;
		SongwriterServiceProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					SongwriterServiceProfile.findByIdAndUpdate(profiles[0]._id, { $set: req.body }, { new: true })
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
