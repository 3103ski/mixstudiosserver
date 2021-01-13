const express = require('express');
const fd = require('../../../constants/fakeData');
const instrumentPricingProfiles = fd.instrumentPricingProfiles;

const instrumentPricingRouter = express.Router();

// All instrument pricing profiles
instrumentPricingRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		res.end(instrumentPricingProfiles);
	})
	.post((req, res) => {
		res.end('will add new instrument pricing profile');
	})
	.delete((req, res) => {
		res.end('DELETE not supported at this endpoint');
	})
	.put((req, res) => {
		res.end('PUT is not supported at this endpoint');
	});

// All instrument pricing profiles for a particular studio musician pricing profile
instrumentPricingRouter
	.route('/:pricingProfileId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.pricingProfileId;
		const profileInstruments = instrumentPricingProfiles.map((instrument) => (instrument.pricingProfileId === id ? instrument : null));

		res.send(profileInstruments);
	})
	.put((req, res) => {
		res.end('PUT not supported at this end point');
	})
	.post((req, res) => {
		res.end('POST not supported at this endpoint');
	});

// A specific instrument pricing profile
instrumentPricingRouter
	.route('/instruments/:instrumentPricingProfileId')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const id = req.params.instrumentPricingProfileId;
		const profile = instrumentPricingProfiles.filter((profile) => profile.id === id)[0];
		res.send(profile);
	})
	.delete((req, res) => {
		res.end(`Will delete instrument pricing profile for ${req.params.instrumentPricingProfileId}`);
	})
	.put((req, res) => {
		res.end('Will update the existing profile with new data');
	})
	.post((req, res) => {
		res.end('POST is not supported at this endpoint');
	});

module.exports = instrumentPricingRouter;
