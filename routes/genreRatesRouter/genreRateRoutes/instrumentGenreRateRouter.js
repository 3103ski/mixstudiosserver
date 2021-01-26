const express = require('express');
const InstrumentGenreRates = require('../../../models/genreRates/instrumentGenreRate');
const InstrumentPricingProfile = require('../../../models/pricingProfiles/instrumentPricingProfile');

const instrumentGenreRateRouter = express.Router();

instrumentGenreRateRouter
	.route('/')
	.get((req, res, next) => {
		InstrumentGenreRates.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		InstrumentGenreRates.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res) => {
		InstrumentGenreRates.deleteMany()
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

instrumentGenreRateRouter
	.route('/profile-collection/:instrumentPricingProfileId')
	.get((req, res, next) => {
		const id = req.params.instrumentPricingProfileId;
		InstrumentPricingProfile.find({ instrumentPricingProfileId: id })
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		const id = req.params.instrumentPricingProfileId;
		InstrumentPricingProfile.deleteMany({ instrumentPricingProfileId: id })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You cannot POST at this endpoint');
	});

instrumentGenreRateRouter
	.route('/:genreRateId')
	.get((req, res, next) => {
		InstrumentPricingProfile.findById(req.params.genreRateId)
			.then((genreRate) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(genreRate);
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		InstrumentPricingProfile.findByIdAndUpdate(req.params.genreRateId, { $set: req.body }, { new: true })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		InstrumentPricingProfile.findByIdAndDelete(req.params.genreRateId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You can not POST to this endpoint');
	});

module.exports = instrumentGenreRateRouter;
