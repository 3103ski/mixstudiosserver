const express = require('express');
const InstrumentProfile = require('../../../models/serviceProfiles/instrumentProfile');
const instrumentProfilesRouter = express.Router();

instrumentProfilesRouter
	.route('/')
	.get((req, res, next) => {
		InstrumentProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		// make sure user doesn't already have this instrument
		InstrumentProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
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
	.route('/user-instrument-collection/:userId')
	.get((req, res, next) => {
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
	.delete((req, res, next) => {
		InstrumentProfile.deleteMany({ userId: req.params.userId })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'appplication/json');
				res.json(response);
			})
			.catch((err) => next(err));
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
	.route('/user-instrument/:instrumentId')
	.get((req, res, next) => {
		const id = req.params.instrumentId;
	})
	.delete((req, res) => {
		res.end('Will delete instrument');
	})
	.put((req, res) => {
		res.end('PUwill update instrument');
	})
	.post((req, res) => {
		res.end('POST not supported at this endpoint');
	});

module.exports = instrumentProfilesRouter;
