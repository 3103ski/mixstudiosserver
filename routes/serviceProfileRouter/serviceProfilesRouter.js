const express = require('express');
// Service Routers
const profiles = require('./serviceRoutes/index');
// Mongoose Models
const SingerServiceProfiles = require('../../models/serviceProfiles/singerServiceProfile');
const MixingServiceProfiles = require('../../models/serviceProfiles/mixingServiceProfile');
const MasteringServiceProfiles = require('../../models/serviceProfiles/masteringServiceProfile');
const StudioMusicianServiceProfiles = require('../../models/serviceProfiles/studioMusicianServiceProfile');
const ProducerServiceProfiles = require('../../models/serviceProfiles/producerServiceProfile');
const SongwriterServiceProfiles = require('../../models/serviceProfiles/songwriterServiceProfile');

const serviceProfilesRouter = express.Router();

serviceProfilesRouter
	.route('/')
	.get((req, res, next) => {
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

serviceProfilesRouter.use('/mixing-engineers', profiles.mixingProfiles);
serviceProfilesRouter.use('/mastering-engineers', profiles.masteringProfiles);
serviceProfilesRouter.use('/singers', profiles.singerProfiles);
serviceProfilesRouter.use('/producers', profiles.producerProfiles);
serviceProfilesRouter.use('/songwriters', profiles.songwriterProfiles);
serviceProfilesRouter.use('/studio-musicians', profiles.studioMusicianProfiles);

module.exports = serviceProfilesRouter;
