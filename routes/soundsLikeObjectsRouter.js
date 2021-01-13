const express = require('express');
const SoundsLikeObject = require('../models/users/soundsLikeObject');

const soundsLikeObjectRouter = express.Router();

soundsLikeObjectRouter
	.route('/')
	.get((req, res, next) => {
		SoundsLikeObject.find()
			.then((slos) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(slos);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SoundsLikeObject.deleteMany()
			.then((respsone) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(respsone);
			})
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		let slo = { ...req.body, userId: req.params.userId };
		slo.soundsLike = slo.soundsLike.toLowerCase();
		SoundsLikeObject.create(slo)
			.then((SLO) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLO);
			})
			.catch((err) => next(err));
	});

// All SLOs not by user, but by artist users say they sound like. Artist name in endpoint should seperate multiple words in name with '-'.
soundsLikeObjectRouter.route('/artist/:artist').get((req, res, next) => {
	let artist = req.params.artist.split('-');
	if (artist.length > 1) {
		artist = artist.join(' ').toLowerCase();
	} else {
		artist = artist[0].toLowerCase();
	}
	console.log(artist);

	SoundsLikeObject.find({ soundsLike: artist })
		.then((results) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(results);
		})
		.catch((err) => next(err));
});

// 'Sounds Like' Objects
soundsLikeObjectRouter
	.route('/user-collections/:userId')
	.get((req, res, next) => {
		SoundsLikeObject.find({ userId: req.params.userId })
			.then((SLOs) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLOs);
			})
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		SoundsLikeObject.deleteMany({ userId: req.params.userId })
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
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST not supported at this endpoint');
	});

module.exports = soundsLikeObjectRouter;
