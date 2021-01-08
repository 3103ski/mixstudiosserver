const express = require('express');
const fd = require('../../../constants/fakeData');
const userInstrumentProfiles = fd.userInstrumentProfiles;

const instrumentProfilesRouter = express.Router();

instrumentProfilesRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		res.send(userInstrumentProfiles);
	})
	.post((req, res) => {
		res.end('will add new instrument profile');
	})
	.put((req, res) => {
		res.end('PUT not supported at this endpoint');
	})
	.delete((req, res) => {
		res.end('DELETE not supported at this endpoint');
	});

instrumentProfilesRouter
	.route('/user-instrument-collection/:userId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.userId;
		const userInstrumentCollection = userInstrumentProfiles.map((instrument) => (instrument.userId === id ? instrument : null));

		res.send(userInstrumentCollection);
	})
	.delete((req, res) => {
		res.end('Will delete all instrument profiles for a user');
	})
	.put((req, res) => {
		res.end('PUT not supported at this endpoint');
	})
	.post((req, res) => {
		res.end('POST not supported at this endpoint');
	});

instrumentProfilesRouter
	.route('/user-instrument/:instrumentId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.instrumentId;
		const instrument = userInstrumentProfiles.filter((instrument) => (instrument.id === id ? instrument : null))[0];

		res.send(instrument);
	})
	.delete((req, res) => {
		res.end('Will delete instrument');
	})
	.put((req, res) => {
		res.end('PUwill update instrument');
	})
	.post((req, res) => {
		res.end('POST not supported at this endpoint');
	});

module.exports = instrumentProfilesRouter;
