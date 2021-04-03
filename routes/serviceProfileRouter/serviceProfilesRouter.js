const express = require('express');
const cors = require('../cors');
const auth = require('../../authenticate');
// Service Routers
const profiles = require('./serviceProfileRoutes/index');
// Mongoose Models
const SingerServiceProfiles = require('../../models/serviceProfiles/singerServiceProfile');
const MixingServiceProfiles = require('../../models/serviceProfiles/mixingServiceProfile');
const MasteringServiceProfiles = require('../../models/serviceProfiles/masteringServiceProfile');
const StudioMusicianServiceProfiles = require('../../models/serviceProfiles/studioMusicianServiceProfile');
const ProducerServiceProfiles = require('../../models/serviceProfiles/producerServiceProfile');
const SongwriterServiceProfiles = require('../../models/serviceProfiles/songwriterServiceProfile');
// pricing
const MixingPricingProfile = require('../../models/pricingProfiles/mixingPricingProfile');
const MasteringPricingProfile = require('../../models/pricingProfiles/masteringPricingProfile');
const SongwriterPricingProfile = require('../../models//pricingProfiles/songwriterPricingProfile');
const ProducerPricingProfile = require('../../models//pricingProfiles//producerPricingProfile');

const serviceProfilesRouter = express.Router();

serviceProfilesRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		let allProfiles = [];
		SingerServiceProfiles.find()
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				return MixingServiceProfiles.find();
			})
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				return MasteringServiceProfiles.find();
			})
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				return StudioMusicianServiceProfiles.find();
			})
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				return ProducerServiceProfiles.find();
			})
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				return SongwriterServiceProfiles.find();
			})
			.then((profiles) => {
				allProfiles = [...allProfiles, ...profiles];
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(allProfiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot post to this endpoint');
	})
	.delete((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot delete to this endpoint');
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot put to this endpoint');
	});

serviceProfilesRouter
	.route('/fetch-user-profiles')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		let allProfiles = {};
		SingerServiceProfiles.find({ userId: req.user._id })
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.singer = profiles[0];
				}
				return MixingServiceProfiles.find({ userId: req.user._id });
			})
			.then((profiles) => {
				if (profiles[0]) {
					let foundMixingProfile = profiles[0];
					MixingPricingProfile.find({
						mixingServiceProfileId: foundMixingProfile._id,
					})
						.then((prices) => {
							foundMixingProfile.pricing.pricingProfiles = prices;
						})
						.catch((err) => next(err));
					allProfiles.mixing = foundMixingProfile;
				}
				return MasteringServiceProfiles.find({ userId: req.user._id });
			})
			.then((profiles) => {
				if (profiles[0]) {
					let foundMasteringProfile = profiles[0];
					MasteringPricingProfile.find({
						masteringServiceProfileId: foundMasteringProfile._id,
					})
						.then((prices) => {
							foundMasteringProfile.pricing.pricingProfiles = prices;
						})
						.catch((err) => next(err));
					allProfiles.mastering = foundMasteringProfile;
				}
				return StudioMusicianServiceProfiles.find({ userId: req.user._id });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.studioMusician = profiles[0];
				}
				return ProducerServiceProfiles.find({ userId: req.user._id });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.producer = profiles[0];
				}
				if (profiles[0]) {
					let foundProducerProfile = profiles[0];
					ProducerPricingProfile.find({
						producerServiceProfileId: foundProducerProfile._id,
					})
						.then((prices) => {
							foundProducerProfile.pricing.pricingProfiles = prices;
						})
						.catch((err) => next(err));
					allProfiles.mastering = foundProducerProfile;
				}
				return SongwriterServiceProfiles.find({ userId: req.user._id });
			})
			.then((profiles) => {
				if (profiles[0]) {
					let foundSongwriterProfile = profiles[0];
					SongwriterPricingProfile.find({
						songwriterServiceProfileId: foundSongwriterProfile._id,
					})
						.then((prices) => {
							foundSongwriterProfile.pricing.pricingProfiles = prices;
						})
						.then(() => {
							allProfiles.songwriter = foundSongwriterProfile;
						})
						.then(() => {
							res.statusCode = 200;
							res.setHeader('Content-Header', 'application/json');
							res.json(allProfiles);
						})
						.catch((err) => next(err));
				}
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot post to this endpoint');
	})
	.delete((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot delete to this endpoint');
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot put to this endpoint');
	});

serviceProfilesRouter
	.route('/fetch-user-profiles/:userId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		let allProfiles = {};
		SingerServiceProfiles.find({ userId: req.params.userId })
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.singer = profiles[0];
				}
				return MixingServiceProfiles.find({ userId: req.params.userId });
			})
			.then((profiles) => {
				if (profiles[0]) {
					let foundMixingProfile = profiles[0];
					MixingPricingProfile.find({
						mixingServiceProfileId: foundMixingProfile._id,
					})
						.then((prices) => {
							foundMixingProfile.pricing.pricingProfiles = prices;
						})
						.catch((err) => next(err));
					allProfiles.mixing = foundMixingProfile;
				}
				return MasteringServiceProfiles.find({ userId: req.params.userId });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.mastering = profiles[0];
				}
				return StudioMusicianServiceProfiles.find({ userId: req.params.userId });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.studioMusician = profiles[0];
				}
				return ProducerServiceProfiles.find({ userId: req.params.userId });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.producer = profiles[0];
				}
				return SongwriterServiceProfiles.find({ userId: req.params.userId });
			})
			.then((profiles) => {
				if (profiles[0]) {
					allProfiles.songwriter = profiles[0];
				}
				res.statusCode = 200;
				res.setHeader('Content-Header', 'application/json');
				res.json(allProfiles);
			})
			.catch((err) => next(err));
	})
	.post((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot post to this endpoint');
	})
	.delete((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot delete to this endpoint');
	})
	.put((req, res) => {
		res.statusCode = 405;
		res.setHeader('Content-Header', 'application/json');
		res.end('You cannot put to this endpoint');
	});

serviceProfilesRouter.use('/mixing-engineers', profiles.mixingProfiles);
serviceProfilesRouter.use('/mastering-engineers', profiles.masteringProfiles);
serviceProfilesRouter.use('/singers', profiles.singerProfiles);
serviceProfilesRouter.use('/producers', profiles.producerProfiles);
serviceProfilesRouter.use('/songwriters', profiles.songwriterProfiles);
serviceProfilesRouter.use('/studio-musicians', profiles.studioMusicianProfiles);

module.exports = serviceProfilesRouter;
