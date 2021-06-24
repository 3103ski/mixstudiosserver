const express = require('express');
const StudioFeedPost = require('../../models/social/feeds/studioFeedPost');
const Activity = require('../../models/social/feeds/activityFeedPost');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Like = require('../../models/social/like');

const cors = require('../cors');
const auth = require('../../authenticate');

const studioFeedPostRouter = express.Router();

studioFeedPostRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		console.log('We got this feed post: ', req.body);
		StudioFeedPost.create(req.body)
			.then((newPost) => {
				StudioFeedPost.findOne({ _id: newPost._id })
					.then((post) => {
						Activity.findOne({ _id: post.activityId })
							.then((activity) => {
								activity.isPosted = true;
								activity.save();
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(post);
							})
							.catch((error) => next(error));
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	})
	.get(cors.cors, (req, res, next) => {
		StudioFeedPost.find({ userId: req.userId }).then((posts) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(posts);
		});
	});

studioFeedPostRouter
	.route('/dashboard-feed')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		StudioFeedPost.find({ userId: { $in: [...req.user.following, req.user._id] } })
			.then((posts) => {
				if (posts) {
					console.log('Found these: ', posts);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(posts);
				}
			})
			.catch((error) => next(error));
	});

studioFeedPostRouter
	.route('/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		StudioFeedPost.find({ userId: req.params.userId })
			.then((posts) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(posts);
			})
			.catch((error) => next(error));
	});

studioFeedPostRouter
	.route('/like-post/:postId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		StudioFeedPost.findOne({ _id: req.params.postId })
			.then((post) => {
				console.log('Heard the like on the server');
				Like.create({ userId: req.user._id })
					.then((newLike) => {
						post.likes.push(newLike._id);
						post.save();
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({ updatedPost: post });
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	});

studioFeedPostRouter
	.route('/unlike-post/:postId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		StudioFeedPost.findOne({ _id: req.params.postId })
			.then((post) => {
				let likeId = null;
				const updatedLikes = post.likes
					.map((like) => {
						if (like.userId === req.user._id.toString()) {
							likeId = like._id;
							return null;
						} else {
							return like;
						}
					})
					.filter((like) => like !== null);
				post.likes = updatedLikes;
				post.save();
				return Like.deleteOne({ _id: likeId })
					.then((res) => {
						console.log(res);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({ updatedPost: post });
					})
					.catch((error) => next(error));
			})
			.catch((error) => next(error));
	});

module.exports = studioFeedPostRouter;
