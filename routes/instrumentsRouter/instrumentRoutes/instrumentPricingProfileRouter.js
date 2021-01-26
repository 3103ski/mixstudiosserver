const express = require('express');
const InstrumentPricingProfile = require('../../../models/pricingProfiles/instrumentPricingProfile');

const instrumentPricingRouter = express.Router();

// All instrument pricing profiles
instrumentPricingRouter
	.route('/')
	.get((req, res, next) => {
		InstrumentPricingProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		InstrumentPricingProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res) => {
		res.statusCode = 405;
		res.end('DELETE not supported at this endpoint');
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT is not supported at this endpoint');
	});

// All instrument pricing profiles for a particular studio musician
instrumentPricingRouter
	.route('/user-colection/:userId')
	.get((req, res, next) => {
		InstrumentPricingProfile.find({ userId: req.params.userId })
			.then((InstrumentProfiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(InstrumentProfiles);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		InstrumentPricingProfile.deleteMany({ userId: req.params.userId })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT not supported at this end point');
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST not supported at this endpoint');
	});

// A specific instrument pricing profile
instrumentPricingRouter
	.route('/:profileId')
	.get((req, res, next) => {
		InstrumentPricingProfile.findById(req.params.profileId)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		InstrumentPricingProfile.findByIdAndDelete(req.params.profileId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		InstrumentPricingProfile.findByIdAndUpdate(req.params.profileId, { $set: req.body }, { new: true })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST is not supported at this endpoint');
	});

module.exports = instrumentPricingRouter;
