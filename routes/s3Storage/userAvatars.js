const express = require('express');
const auth = require('../../authenticate');
const cors = require('../cors');
const User = require('../../models/users/userProfile');

const AWS = require('aws-sdk');
const FileType = require('file-type');
const multiparty = require('multiparty');
const fs = require('fs');
const { AWS_KEY, AWS_SECRET } = require('../../config.js').credentials;

AWS.config.update({
	accessKeyId: AWS_KEY,
	secretAccessKey: AWS_SECRET,
});

const s3 = new AWS.S3();

const avatarUploadRouter = express.Router();

const uploadAvatar = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-avatars',
		Key: `${name}`,
	};

	return s3.upload(params).promise();
};

const deleteFile = (key) => {
	const params = {
		Bucket: 'ms-avatars',
		Key: `${key}`,
	};

	return s3.deleteObject(params).promise();
};

const checkForAvatar = (userId) => {
	const params = {
		Bucket: 'ms-avatars',
		Key: userId,
	};

	return s3.getObject(params).promise();
};

avatarUploadRouter
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

			checkForAvatar(req.user._id.toString())
				.then((avatar) => {
					if (avatar) {
						deleteFile(req.user._id.toString()).then(() => {
							uploadAvatar(buffer, req.user._id.toString(), type)
								.then((s3Res) => {
									User.findById(req.user._id)
										.then((user) => {
											user.info.avatar = s3Res.Location;
											user.save();
											res.statusCode = 200;
											res.setHeader('Content-Type', 'application/json');
											res.json(user.info);
										})
										.catch((err) => {
											next(err);
										});
								})
								.catch((err) => {
									res.statusCode = 500;
									res.setHeader('Content-Type', 'application/json');
									res.json(err);
								});
						});
					}
				})
				.catch((err) => {
					if (err && err.statusCode === 404) {
						uploadAvatar(buffer, req.user._id.toString(), type)
							.then((s3Res) => {
								User.findById(req.user._id)
									.then((user) => {
										user.userInfo.avatar = s3Res.Location;
										user.save();

										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(user.userInfo);
									})
									.catch((err) => next(err));
							})
							.catch((err) => {
								res.statusCode = 500;
								res.setHeader('Content-Type', 'application/json');
								res.json(err);
							});
					}
				});
		});
	})
	.get(cors.cors, (req, res, next) => {
		PortfolioEntry.find()
			.then((allPortfolioEntries) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(allPortfolioEntries);
			})
			.catch((err) => next(err));
	});

module.exports = avatarUploadRouter;
