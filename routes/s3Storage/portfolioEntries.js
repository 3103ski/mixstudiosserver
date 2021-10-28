const express = require('express');
const auth = require('../../authenticate');
const cors = require('../cors');
const PortfolioEntry = require('../../models/portfolios/portfolioEntries');

const AWS = require('aws-sdk');
const FileType = require('file-type');
const multiparty = require('multiparty');
const fs = require('fs');
const 
const { AWS_KEY, AWS_SECRET } = require('../../config.js').credentials;

AWS.config.update({
	accessKeyId: AWS_KEY,
	secretAccessKey: AWS_SECRET,
});

const s3 = new AWS.S3();

const portfolioEntryRouter = express.Router();

const uploadFile = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-audio-storage',
		Key: `${name}.${type.ext}`,
	};

	return s3.upload(params).promise();
};
const deleteFile = (key) => {
	const params = {
		Bucket: 'ms-audio-storage',
		Key: `${key}`,
	};

	return s3.deleteObject(params).promise();
};

portfolioEntryRouter
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

			const path = files.audioOne[0].path;
			const buffer = fs.readFileSync(path);
			const type = await FileType.fromBuffer(buffer);
			const fileName = `${Date.now().toString()}${files.audioOne[0].size}`;

			let payload = await {
				userId: req.user._id,
				title: fields.title[0],
				description: fields.description[0],
				genreOne: fields.genreOne[0],
				genreTwo: fields.genreTwo[0],
				audioOne: null,
				audioTwo: null,
				audioOneOriginalName: files.audioOne[0].originalFilename,
				audioTwoOriginalName: null,
				category: fields.category[0],
				isBeforeAfter: fields.isBeforeAfter[0],
			};

			uploadFile(buffer, fileName, type)
				.then(async (fileOneResponse) => {
					payload.audioOne = fileOneResponse.Key;

					if (files.audioTwo) {
						payload.audioTwoOriginalName = files.audioTwo[0].originalFilename;

						const pathTwo = files.audioTwo[0].path;
						const bufferTwo = fs.readFileSync(pathTwo);
						const typeTwo = await FileType.fromBuffer(bufferTwo);
						const fileNameTwo = `${Date.now().toString()}${files.audioTwo[0].size}`;

						await uploadFile(bufferTwo, fileNameTwo, typeTwo).then(
							async (fileTwoResponse) => {
								payload.audioTwo = fileTwoResponse.Key;
								return PortfolioEntry.create(payload);
							}
						);
					} else {
						return PortfolioEntry.create(payload);
					}
				})
				.then((newEntry) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(newEntry);
				})
				.catch((err) => next(err));
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
						deleteFile(profile.audioOne)
							.then((s3Res) => {
								PortfolioEntry.findByIdAndDelete(entryId)
									.then((deleteResponse) => {
										res.status = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(deleteResponse);
									})
									.catch((err) => {
										next(err);
									});
							})
							.catch((err) => next(err));
					}
					if (profile.audioTwo) {
						deleteFile(profile.audioTwo)
							.then((s3Res) => {
								PortfolioEntry.findByIdAndDelete(entryId)
									.then((deleteResponse) => {
										res.status = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(deleteResponse);
									})
									.catch((err) => {
										next(err);
									});
							})
							.catch((err) => next(err));
					}
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
	.get(cors.cors, (req, res, next) => {
		const id = req.params.userId;
		if (id !== null && id !== undefined) {
			PortfolioEntry.find({ userId: id })
				.then((portfolio) => {
					res.status = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(portfolio);
				})
				.catch((err) => next(err));
		} else {
			res.status = 404;
			res.setHeader('Content-Type', 'application/json');
			res.json({ error: 'There is no id' });
		}
	});

module.exports = portfolioEntryRouter;
