const express = require('express');
const Conversation = require('../../models/social/thread');
const Comment = require('../../models/social/comment');

const cors = require('../cors');
const auth = require('../../authenticate');

const conversationRouter = express.Router();

conversationRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Conversation.create()
			.then((newConversation) => {
				newConversation.comments.push(req.body.initialComment);
				newConversation.subscribers.push(req.user._id);
				newConversation.save();

				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(newConversation);
			})
			.catch((err) => next(err));
	})
	.get(cors.cors, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
		Conversation.find()
			.then((allConversations) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(allConversations);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg:
				'You cant delete all the conversations in the database using this endpoint. Contact admin and query direct to database if this is in fact the action you want. ',
		});
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({ errorMsg: 'You can not put at this endpoint' });
	});

conversationRouter
	.route('/subscribe/:convoId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.delete(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.put(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		const convoId = req.params.convoId;
		Conversation.find(convoId).then((convo) => {
			if (!convo.subscribers.includes(req.user._id)) {
				convo.subscribers.push(req.user._id);
				convo.save();
			}

			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(convo);
		});
	});

conversationRouter
	.route('/unsubscribe/:convoId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res) => {
		const convoId = req.params.convoId;
		Conversation.find(convoId).then((convo) => {
			if (convo.subscribers.includes(req.user._id)) {
				const updatedSubscribers = convo.subscribers.filter((sub) => sub !== req.user._id);
				convo.subscribers = updatedSubscribers;
				convo.save();
			}

			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(convo);
		});
	})
	.get(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.delete(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.put(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	});

conversationRouter
	.route('/comment')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Comment.create({ ...req.body, userId: req.body._id })
			.then((newComment) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(newComment);
			})
			.catch((err) => next(err));
	})
	.get(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.delete(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.put(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	});

conversationRouter
	.route('/comment-reply/:originalCommentId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Comment.create({ ...req.body, userId: req.body._id, isCommentReply: true })
			.then((newReply) => {
				Comment.find(req.params.originalCommentId).then((ogComment) => {
					ogComment.replies.push(newReply);
					ogComment.save();
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(ogComment);
				});
			})
			.catch((err) => next(err));
	})
	.get(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.delete(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	})
	.put(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 304;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			errorMsg: 'This endpoint is only intended for posting subscriptions to a conversation',
		});
	});

module.exports = conversationRouter;
