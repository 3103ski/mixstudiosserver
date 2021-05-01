const express = require('express');
const UpdateReport = require('../../models/utilityForms/updateReport');

const cors = require('../cors');
const auth = require('../../authenticate');

const updateReportRouter = express.Router();

updateReportRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		UpdateReport.find()
			.then((reports) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(reports);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		UpdateReport.create(req.body)
			.then((report) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(report);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res) => {
		UpdateReport.deleteMany()
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

updateReportRouter
	.route('/:reportId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		const id = req.params.reportId;
		UpdateReport.findOne(id)
			.then((profile) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(profile);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const id = req.params.reportId;
		UpdateReport.findById(id).then((report) => {
			if (report && report.userId === req.user._id) {
				UpdateReport.deleteOne(id)
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
		UpdateReport.findById(id).then((report) => {
			if (report && report._id) {
				UpdateReport.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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

module.exports = updateReportRouter;
