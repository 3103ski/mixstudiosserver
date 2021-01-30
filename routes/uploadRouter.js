const express = require('express');
const multer = require('multer');
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

//__________
// AVATARS
//----------
const avatarStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/avatars');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
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
					user.userInfo.avatar = req.file.filename;
					user.save();
					console.log('The User that needs an avatar: \n', user);

					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(req.file);
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

module.exports = uploadRouter;
