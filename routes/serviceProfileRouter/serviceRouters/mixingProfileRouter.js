const express = require('express');
const fd = require('../../../constants/fakeData');
const mixingServiceProfiles = fd.mixingServiceProfiles;

const mixingProfileRouter = express.Router();

mixingProfileRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		res.send(mixingServiceProfiles);
	})
	.post((req, res) => {
		res.end('We will add the new mixing service profile');
	})
	.put((req, res) => {
		res.end('You cannot PUT at this endpoint');
	})
	.delete((req, res) => {
		res.end('You cannot DELETE this endpoint');
	});

mixingProfileRouter
	.route('/:userId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.userId;
		const profile = mixingServiceProfiles.filter((profile) => profile.userId === id);
		if (profile.length === 0) {
			res.end(`User ${req.params.userId} does not have a mixing service profile`);
		}
		res.send(profile[0]);
	})
	.delete((req, res) => {
		res.end(`User with id: ${req.params.userId}\nwill be deleted.`);
	})
	.put((req, res) => {
		res.end(`We will update the profile for user ${req.params.userId}`);
	})
	.post((req, res) => {
		res.end('You cannot POST at this endpoint');
	});

module.exports = mixingProfileRouter;
