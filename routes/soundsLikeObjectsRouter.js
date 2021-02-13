const express = require('express');
const SoundsLikeObject = require('../models/users/soundsLikeObject');
const cors = require('./cors');
const auth = require('../authenticate');
const soundsLikeObjectRouter = express.Router();

soundsLikeObjectRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		SoundsLikeObject.find()
			.then((slos) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(slos);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		SoundsLikeObject.deleteMany()
			.then((respsone) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(respsone);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		let slo = { ...req.body, userId: req.user._id };
		slo.title = slo.title.toLowerCase();

		SoundsLikeObject.create(slo)
			.then((SLO) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLO);
			})
			.catch((err) => next(err));
	});

// All SLOs not by user, but by artist users say they sound like. Artist name in endpoint should seperate multiple words in name with '-'.
soundsLikeObjectRouter
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.route('/artist/:artist')
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
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
	.route('/user-collection')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		SoundsLikeObject.find({ userId: req.user._id })
			.then((SLOs) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(SLOs);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		if (req.user._id) {
			SoundsLikeObject.deleteMany({ userId: req.user._id })
				.then((response) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(response);
				})
				.catch((err) => next(err));
		} else {
			res.statusCode = 403;
			res.setHeader('Content-Type', 'application/json');
			res.end('The files you are trying to delete do not belong to your account.');
		}
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT not supported at this endpoint');
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST not supported at this endpoint');
	});

soundsLikeObjectRouter
	.route('/:soundsLikeID')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		SoundsLikeObject.findById(req.params.soundsLikeID)
			.then((slo) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(slo);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		SoundsLikeObject.findById(req.params.soundsLikeID).then((slo) => {
			console.log('SLO ID', slo);
			console.log('USER ID', req.user);
			if (req.user._id.equals(slo.userId)) {
				SoundsLikeObject.findByIdAndDelete(req.params.soundsLikeID)
					.then((respsone) => {
						SoundsLikeObject.find({ userId: req.user._id }).then((list) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({ res: respsone, updatedList: list });
						});
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 403;
				res.setHeader('Content-Type', 'application/json');
				res.end('You do not own the data you are trying to delete.');
			}
		});
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
