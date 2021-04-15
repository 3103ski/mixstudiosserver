const express = require('express');
const multer = require('multer');
const deleteWithFSFromRoot = require('../../fs');
const auth = require('../../authenticate');
const cors = require('../cors');
const PortfolioEntry = require('../../models/portfolios/portfolioEntries');

const AWS = require('aws-sdk');
const FileType = require('file-type');
const multiparty = require('multiparty');
const fs = require('fs');

AWS.config.update({
	accessKeyId: 'AKIARRLEMNTVQBYT73P7',
	secretAccessKey: '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',
});

// const s3 = new AWS.S3();

const portfolioEntryRouter = express.Router();

const uploadFile = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-audio-storage',
		Key: `${name}.${type.ext}`,
	};
	console.log('these are the params: ', params);
	return s3.upload(params).promise();
};

portfolioEntryRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, (req, res, next) => {
		console.log('We in the post');
		const form = new multiparty.Form();

		// res.status = 200;
		// res.setHeader('Content-Type', 'application/json');
		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.json({ return: 'everything kinda works?' });

		form.parse(req, async (error, fields, files) => {
			if (error) {
				response.status = 500;
				response.setHeader('Content-Type', 'application/json');
				response.json(error);
			}
			console.log('We past the first error check inside parse function');

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
						console.log('we had a second file to upload');
						payload.audioTwoOriginalName = files.audioTwo[0].originalFilename;

						const pathTwo = files.audioTwo[0].path;
						const bufferTwo = fs.readFileSync(pathTwo);
						const typeTwo = await FileType.fromBuffer(bufferTwo);
						const fileNameTwo = `${Date.now().toString()}${files.audioTwo[0].size}`;

						await uploadFile(bufferTwo, fileNameTwo, typeTwo).then(
							async (fileTwoResponse) => {
								payload.audioTwo = fileTwoResponse.Key;
								console.log('Sending this DOUBLE SONG payload: ', payload);
								return PortfolioEntry.create(payload);
							}
						);
					} else {
						console.log('Sending this SINGLE SONG payload: ', payload);
						return PortfolioEntry.create(payload);
					}
				})
				.then((newEntry) => {
					console.log('SENDING THIS BACK: ', newEntry);
					response.status = 200;
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Access-Control-Allow-Origin', '*');

					// res.json({ return: 'everything kinda works?' });
					response.json(newEntry);
				})
				.catch((err) => next(err));
		});
	})
	.get(cors.cors, (req, res, next) => {
		PortfolioEntry.find()
			.then((allPortfolioEntries) => {
				res.status = 200;
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
						deleteWithFSFromRoot.publicAccessDelete('/audio/', profile.audioOne);
					}
					if (profile.audioTwo) {
						deleteWithFSFromRoot.publicAccessDelete('/audio/', profile.audioTwo);
					}
					PortfolioEntry.findByIdAndDelete(entryId)
						.then((deleteResponse) => {
							res.status = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(deleteResponse);
						})
						.catch((err) => next(err));
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
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		const id = req.params.userId;
		PortfolioEntry.find({ userId: id })
			.then((portfolio) => {
				res.status = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(portfolio);
			})
			.catch((err) => next(err));
	});

module.exports = portfolioEntryRouter;
