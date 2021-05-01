const express = require('express');
const BugReport = require('../../models/utilityForms/bugReport');

const cors = require('../cors');
const auth = require('../../authenticate');

const bugReportRouter = express.Router();

bugReportRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		console.log('We made it in');
		BugReport.find()
			.then((profiles) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profiles);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		BugReport.create({ ...req.body, userId: req.user._id })
			.then((newBigReport) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(newBigReport);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res) => {
		BugReport.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({ errorMsg: 'You can not put at this endpoint' });
	});

bugReportRouter
	.route('/:reportId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.reportId;
		BugReport.findOne(id)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.reportId;
		BugReport.findById(id).then((report) => {
			if (report && report.userId === req.user._id) {
				BugReport.deleteOne(id)
					.then((response) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(response);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'application/json');
				res.json({
					errorMsg: 'the report you are trying to delete does not belong to you',
				});
			}
		});
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.reportId;
		BugReport.findById(id).then((report) => {
			if (report && report._id) {
				BugReport.findByIdAndUpdate(id, { $set: req.body }, { new: true })
					.then((response) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(response);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'application/json');
				res.json({
					errorMsg: 'the report you are trying to update does not belong to you',
				});
			}
		});
	})
	.post((req, res) => {
		res.end('You cannot POST at this endpoint');
	});

module.exports = bugReportRouter;
