const express = require('express');
const ActivityPost = require('../../models/social/feeds/activityFeedPost');
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

const cors = require('../cors');
const auth = require('../../authenticate');

const activityFeedPostRouter = express.Router();

activityFeedPostRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		console.log('Server got the activityPost: ', req.body);
		ActivityPost.create(req.body)
			.then((newPost) => {
				ActivityPost.findOne({ _id: newPost._id })
					.then((activity) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(activity);
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	})
	.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		ActivityPost.find({ userId: req.user._id.toString() })
			.then((posts) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(posts);
			})
			.catch((err) => {
				return next(err);
			});
	});

module.exports = activityFeedPostRouter;
