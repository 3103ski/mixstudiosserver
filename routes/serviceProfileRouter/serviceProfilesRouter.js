const express = require('express');
// Service Routers
const profiles = require('./serviceRouters/index');

// fake data
const fd = require('../../constants/fakeData');

const serviceProfilesRouter = express.Router();

serviceProfilesRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/json');
		next();
	})
	.get((req, res) => {
		const allProfiles = [
			...fd.songwriterServiceProfiles,
			...fd.mixingServiceProfiles,
			...fd.masteringServiceProfiles,
			...fd.studioMusicianServiceProfiles,
			...fd.producerServiceProfiles,
			...fd.singerServiceProfiles,
		];
		res.send(allProfiles);
	})
	.post((req, res) => {
		res.send({
			error: 'You cannot post directly to this endpoint. You are likely forgetting to include the service name in the endpoint.',
		});
	})
	.delete((req, res) => {
		res.end('DELETE not supported at this endpoint.');
	})
	.put((req, res) => {
		res.end('PUT not supported at this endpoint.');
	});

serviceProfilesRouter.use('/mixing-engineers', profiles.mixingProfiles);
serviceProfilesRouter.use('/mastering-engineers', profiles.masteringProfiles);
serviceProfilesRouter.use('/singers', profiles.singerProfiles);
serviceProfilesRouter.use('/producers', profiles.producerProfiles);
serviceProfilesRouter.use('/songwriters', profiles.songwriterProfiles);
serviceProfilesRouter.use('/studio-musicians', profiles.studioMusicianProfiles);

module.exports = serviceProfilesRouter;
