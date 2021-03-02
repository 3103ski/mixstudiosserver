const express = require('express');
const multer = require('multer');
const deleteWithFSFromRoot = require('../fs');
const authenticate = require('../authenticate');
const cors = require('./cors');

const User = require('../models/users/userProfile');

const uploadRouter = express.Router();

//__________
// FILTERS
//----------
const imageFileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('You can upload only image files'), false);
	}
	cb(null, true);
};
// const audioFileFilter = (req, file, cb) => {
// 	if (!file.originalname.match(/\.(mp3|wav)$/)) {
// 		return cb(new Error('You can upload only audio files here'), false);
// 	}
// 	cb(null, true);
// };

//__________
// AVATARS
//----------
const avatarStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/avatars');
	},
});

const avatarUpload = multer({ storage: avatarStorage, fileFilter: imageFileFilter });

uploadRouter
	.route('/avatars')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`GET operation not supported on /imageUpload`);
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		avatarUpload.single('imageFile'),
		(req, res, next) => {
			User.findById(req.user._id)
				.then((user) => {
					return deleteWithFSFromRoot.publicAccessDelete(
						'/images/avatars/',
						user.userInfo.avatar
					);
				})
				.then((response) => {
					User.findById(req.user._id).then((user) => {
						user.userInfo.avatar = req.file.filename;
						user.save();
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(user);
					});
				})
				.catch((err) => next(err));
		}
	)
	.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`PUT operation not supported on /imageUpload`);
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`DELETE operation not supported on /imageUpload`);
	});

//__________
// AUDIO
//----------
const audioStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/audio');
	},
});

const audioUpload = multer({ storage: audioStorage });

uploadRouter
	.route('/audio')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`GET operation not supported on /audio`);
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		audioUpload.array('audio/wav'),
		(req, res, next) => {
			console.log('THE BODY!', req.body);
			console.log('THE files!', req.files);
			res.setHeader('Content-Type', 'application/json');
			res.statusCode = 200;
			res.end('recieved');
			// console.log('THE FILE!', req.file.filename);
			// User.findById(req.user._id)
			// 	.then((user) => {
			// 		return deleteWithFSFromRoot.publicAccessDelete('/audio/', user.userInfo.avatar);
			// 	})
			// 	.then((response) => {
			// 		User.findById(req.user._id).then((user) => {
			// 			user.userInfo.avatar = req.file.filename;
			// 			user.save();
			// 			res.statusCode = 200;
			// 			res.setHeader('Content-Type', 'application/json');
			// 			res.json(user);
			// 		});
			// 	})
			// 	.catch((err) => next(err));
		}
	)
	.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`PUT operation not supported on /imageUpload`);
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
		res.statusCode = 403;
		res.end(`DELETE operation not supported on /imageUpload`);
	});

module.exports = uploadRouter;
