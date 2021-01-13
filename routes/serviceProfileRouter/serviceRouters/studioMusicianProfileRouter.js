const express = require('express');
const StudioMusicianProfile = require('../../../models/serviceProfiles/studioMusicianServiceProfile');
const UserProfile = require('../../../models/users/userProfile');

const studioMusicianProfileRouter = express.Router();

studioMusicianProfileRouter
	.route('/')
	.get((req, res, next) => {
		StudioMusicianProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		StudioMusicianProfile.find({ userId: req.body.userId })
			.then((profiles) => {
				if (profiles[0]) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.end(`User ${req.body.userId} already has a studio musician service profile`);
				} else {
					return StudioMusicianProfile.create(req.body);
				}
			})
			.then((studioMusicianProfile) => {
				UserProfile.findById(studioMusicianProfile.userId).then((profile) => {
					profile.serviceProfiles.studioMusician.profileId = studioMusicianProfile._id;
					profile.save();
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(studioMusicianProfile);
				});
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		StudioMusicianProfile.deleteMany()
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

studioMusicianProfileRouter
	.route('/:userId')
	.get((req, res, next) => {
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
	.delete((req, res, next) => {
		const id = req.params.userId;
		StudioMusicianProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
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
	.put((req, res, next) => {
		const id = req.params.userId;
		StudioMusicianProfile.find({ userId: id })
			.then((profiles) => {
				if (profiles[0]) {
					StudioMusicianProfile.findByIdAndUpdate(profiles[0]._id, { $set: req.body }, { new: true })
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
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

module.exports = studioMusicianProfileRouter;
