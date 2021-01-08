const express = require('express');
const fd = require('../constants/fakeData');
const userProfiles = fd.userProfiles;
const soundsLikeDB = fd.artistSoundsLikeCollection;

const userProfileRouter = express.Router();

userProfileRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		res.send(userProfiles);
	})
	.post((req, res) => {
		res.end('We will add new profile');
	})
	.put((req, res) => {
		res.end('PUT not supported at this endpoint');
	})
	.delete((req, res) => {
		res.end('DELETE not supported at this endpoint.');
	});

userProfileRouter
	.route('/:userId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.userId;
		const profile = userProfiles.filter((profile) => profile.userId === id)[0];
		if (profile === null) {
			res.end('This user id does not exist');
		}
		res.send(profile);
	})
	.put((req, res) => {
		res.end('We will update the user profile');
	})
	.delete((req, res) => {
		res.end('We will delete this user profile');
	})
	.post((req, res) => {
		res.end('POST is not supported at this endpoint');
	});

userProfileRouter
	.route('/sounds-like/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.post((req, res) => {
		res.end('You cannot POST to this endpoint');
	})
	.get((req, res) => {
		res.send(soundsLikeDB);
	});

userProfileRouter
	.route('/sounds-like/:userId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.post((req, res) => {
		res.end('You cannot POST to this endpoint');
	})
	.get((req, res) => {
		const id = req.params.userId;
		const soundsLike = soundsLikeDB.filter((sl) => sl.userId === id);
		res.send(soundsLike);
	});

module.exports = userProfileRouter;
