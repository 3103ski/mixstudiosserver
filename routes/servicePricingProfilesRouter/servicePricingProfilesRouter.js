const express = require('express');
const priceProfiles = require('./servicePricingRoutes/index');

const ProducerPricingProfile = require('../../models/pricingProfiles/producerPricingProfile');
const MixingPricingProfile = require('../../models/pricingProfiles/mixingPricingProfile');
const MasteringPricingProfile = require('../../models/pricingProfiles/masteringPricingProfile');
const SongwriterPricingProfile = require('../../models/pricingProfiles/songwriterPricingProfile');
const SingerPricingProfile = require('../../models/pricingProfiles/singerPricingProfile');
const StudioMusicianPricingProfile = require('../../models/pricingProfiles/studioMusicianPricingProfile');

const servicePricingProfileRouter = express.Router();

servicePricingProfileRouter
	.route('/')
	.get((req, res, next) => {
		let allProfiles = [];
		ProducerPricingProfile.find()
			.then((producerProfiles) => {
				allProfiles = [...allProfiles, ...producerProfiles];
				return MixingPricingProfile.find();
			})
			.then((mixingProfiles) => {
				allProfiles = [...allProfiles, ...mixingProfiles];
				return MasteringPricingProfile.find();
			})
			.then((masteringProfiles) => {
				allProfiles = [...allProfiles, ...masteringProfiles];
				return SongwriterPricingProfile.find();
			})
			.then((songwriterProfiles) => {
				allProfiles = [...allProfiles, ...songwriterProfiles];
				return SingerPricingProfile.find();
			})
			.then((singerProfiles) => {
				allProfiles = [...allProfiles, ...singerProfiles];
				return StudioMusicianPricingProfile.find();
			})
			.then((musicianProfiles) => {
				allProfiles = [...allProfiles, ...musicianProfiles];
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(allProfiles);
			})
			.catch((err) => next(err));
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.end('PUT not allowed at this endpoint');
	})
	.delete((req, res) => {
		res.statusCode = 405;
		res.end('DELETE not allowed at this endpoint');
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.end('POST not allowed at this endpoint');
	});

servicePricingProfileRouter.use('/producer', priceProfiles.producerPricingRouter);
servicePricingProfileRouter.use('/mixing', priceProfiles.mixingPricingRouter);
servicePricingProfileRouter.use('/mastering', priceProfiles.masteringPricingRouter);
servicePricingProfileRouter.use('/studio-musician', priceProfiles.studioMusicianRouter);
servicePricingProfileRouter.use('/songwriter', priceProfiles.songwriterPricingRouter);
servicePricingProfileRouter.use('/singer', priceProfiles.singerPricingRouter);

module.exports = servicePricingProfileRouter;
