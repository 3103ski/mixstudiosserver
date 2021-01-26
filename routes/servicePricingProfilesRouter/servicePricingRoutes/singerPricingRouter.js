const express = require('express');
const SingerPricingProfile = require('../../../models/pricingProfiles/singerPricingProfile');

const singerPricingRouter = express.Router();

singerPricingRouter
	.route('/')
	.get((req, res, next) => {
		SingerPricingProfile.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		SingerPricingProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SingerPricingProfile.deleteMany()
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
singerPricingRouter
	.route('/collection/:userId')
	.get((req, res, next) => {
		SingerPricingProfile.find({ userId: req.params.userId })
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		SingerPricingProfile.create(req.body)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SingerPricingProfile.deleteMany()
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
singerPricingRouter
	.route('/:profileId')
	.get((req, res, next) => {
		SingerPricingProfile.findById({ _id: req.params.profileId })
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})

	.delete((req, res, next) => {
		SingerPricingProfile.findByIdAndDelete(req.params.profileId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		SingerPricingProfile.findByIdAndUpdate(req.params.profileId, { $set: req.body }, { new: true })
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

module.exports = singerPricingRouter;
