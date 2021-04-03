const express = require('express');
const ProducerPricingProfile = require('../../../models/pricingProfiles/producerPricingProfile');

const cors = require('../../cors');
const auth = require('../../../authenticate');

const producerPricingRouter = express.Router();

producerPricingRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		ProducerPricingProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const newProfile = {
			userId: req.user._id,
			...req.body,
		};
		ProducerPricingProfile.create(newProfile)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		ProducerPricingProfile.deleteMany({ userId: req.user._id })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('You can not PUT at this endpoing');
	});

// ALL PRICING PROFILES FOR A USER'S SERVICE PROFILE
producerPricingRouter
	.route('/collection/:userId')
	.get((req, res, next) => {
		ProducerPricingProfile.find({ userId: req.params.userId })
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		ProducerPricingProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		ProducerPricingProfile.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('You can not PUT at this endpoing');
	});

// GET A SPECIFIC PRICING PROFILE
producerPricingRouter
	.route('/:profileId')
	.get((req, res, next) => {
		ProducerPricingProfile.findById({ _id: req.params.profileId })
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		ProducerPricingProfile.findByIdAndDelete(req.params.profileId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		ProducerPricingProfile.findByIdAndUpdate(
			req.params.profileId,
			{ $set: req.body },
			{ new: true }
		)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('You can not POST at this endpoing');
	});

module.exports = producerPricingRouter;
