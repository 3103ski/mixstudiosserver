const express = require('express');
const auth = require('../../authenticate');
const cors = require('../cors');
const User = require('../../models/users/userProfile');

const AWS = require('aws-sdk');
const FileType = require('file-type');
const multiparty = require('multiparty');
const fs = require('fs');

AWS.config.update({
	accessKeyId: 'AKIARRLEMNTVUSD22Y45',
	secretAccessKey: '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',
});

const s3 = new AWS.S3();

const userPicUploadRouter = express.Router();

const uploadImg = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-user-pics',
		Key: `${name}`,
	};

	return s3.upload(params).promise();
};

const deleteImg = (key) => {
	const params = {
		Bucket: 'ms-user-pics',
		Key: `${key}`,
	};

	return s3.deleteObject(params).promise();
};

userPicUploadRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		const form = new multiparty.Form();

		form.parse(req, async (error, fields, files) => {
			if (error) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json(error);
			}

			const path = files.imageFile[0].path;
			const buffer = fs.readFileSync(path);
			const type = await FileType.fromBuffer(buffer);

			User.findById(req.user._id)
				.then((user) => {
					if (user) {
						if (user.info.userPics.length < 15) {
							uploadImg(buffer, `${req.user._id.toString()}${Date.now()}`, type)
								.then((s3Res) => {
									user.info.userPics = [s3Res.key, ...user.info.userPics];
									user.save();
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json({ newPicLocatiom: s3Res.key });
								})
								.catch((err) => next(err));
						} else {
							res.statusCode = 403;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								error: 'You already have the max amount of images for a user',
							});
						}
					} else {
						res.statusCode = 404;
						res.setHeader('Content-Type', 'application/json');
						res.json({
							error: 'User not found',
						});
					}
				})
				.catch((err) => next(err));
		});
	});

userPicUploadRouter
	.route('/:picKey')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		deleteImg(req.params.picKey)
			.then((s3Res) => {
				User.findById(req.user._id)
					.then((user) => {
						if (user) {
							if (req.params.picKey !== undefined) {
								pics = user.info.userPics.filter(
									(pic) => pic !== req.params.picKey
								);
								user.info.userPics = pics;
								user.save();
							}

							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({ updatedPics: pics, response: s3Res });
						}
					})
					.catch((err) => next(err));
			})
			.catch((err) => next(err));
	});

module.exports = userPicUploadRouter;
