const express = require('express');
const multer = require('multer');
const deleteWithFSFromRoot = require('../../fs');
const auth = require('../../authenticate');
const cors = require('../cors');
const PortfolioEntry = require('../../models/portfolios/portfolioEntries');

const portfolioEntryRouter = express.Router();

const audioStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/audio');
	},
});

const audioUpload = multer({ storage: audioStorage });

portfolioEntryRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.cors, auth.verifyUser, audioUpload.array('audio/wav'), (req, res, next) => {
		let portfolioEntry = {
			userId: req.user._id,
			title: req.body.title,
			description: req.body.description,
			genreOne: req.body.genreOne,
			genreTwo: req.body.genreTwo,
			category: req.body.category,
			serviceAssignment: req.body.serviceAssignment,
			image: req.body.image ? req.body.image : null,
			isBeforeAfter: req.body.isBeforeAfter,
			audioOne: req.files[0].filename,
			audioOneOriginalName: req.files[0].originalname,
			audioTwo: req.files[1] ? req.files[1].filename : null,
			audioTwoOriginalName: req.files[1] ? req.files[1].originalname : null,
		};
		portfolioEntry.userId = req.user._id;
		console.log(req.files);
		console.log(portfolioEntry);
		PortfolioEntry.create(portfolioEntry)
			.then((newPortfolioObject) => {
				res.status = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(newPortfolioObject);
			})
			.catch((err) => next(err));
	})
	.get(cors.cors, (req, res, next) => {
		PortfolioEntry.find()
			.then((allPortfolioEntries) => {
				res.status = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(allPortfolioEntries);
			})
			.catch((err) => next(err));
	});

portfolioEntryRouter
	.route('/:entryId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		const entryId = req.params.entryId;
		PortfolioEntry.findById(entryId)
			.then((entry) => {
				res.status = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(entry);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const entryId = req.params.entryId;
		PortfolioEntry.findById(entryId)
			.then((profile) => {
				if (req.user._id.toString() === profile.userId) {
					if (profile.audioOne) {
						deleteWithFSFromRoot.publicAccessDelete('/audio/', profile.audioOne);
					}
					if (profile.audioTwo) {
						deleteWithFSFromRoot.publicAccessDelete('/audio/', profile.audioTwo);
					}
					PortfolioEntry.findByIdAndDelete(entryId)
						.then((deleteResponse) => {
							res.status = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(deleteResponse);
						})
						.catch((err) => next(err));
				} else {
					res.status = 403;
					res.setHeader('Content-Type', 'application/json');
					res.end(`You don't own this porfolio item`);
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const entryId = req.params.entryId;
		PortfolioEntry.findById(entryId)
			.then((profile) => {
				if (req.user._id.toString() === profile.userId) {
					PortfolioEntry.findByIdAndUpdate(entryId, { $set: req.body }, { new: true })
						.then((updatedProfile) => {
							res.status = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(updatedProfile);
						})
						.catch((err) => next(err));
				} else {
					res.status = 403;
					res.setHeader('Content-Type', 'application/json');
					res.end(`You don't own this porfolio item`);
				}
			})
			.catch((err) => next(err));
	});

portfolioEntryRouter
	.route('/fetch-full-portfolio/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		PortfolioEntry.find({ userId: id })
			.then((portfolio) => {
				res.status = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(portfolio);
			})
			.catch((err) => next(err));
	});

module.exports = portfolioEntryRouter;
