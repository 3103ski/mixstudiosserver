const SingerServiceProfiles = require('./serviceProfiles/singerServiceProfile');
const MixingServiceProfiles = require('./serviceProfiles/mixingServiceProfile');
const MasteringServiceProfiles = require('./serviceProfiles/masteringServiceProfile');
const StudioMusicianServiceProfiles = require('./serviceProfiles/studioMusicianServiceProfile');
const ProducerServiceProfiles = require('./serviceProfiles/producerServiceProfile');
const SongwriterServiceProfiles = require('./serviceProfiles/songwriterServiceProfile');
// pricing
const MixingPricingProfile = require('./pricingProfiles/mixingPricingProfile');

// All Pricing Profiles for a user

// All Service Profiles for a user

module.exports = allServiceProfilesForUser = async (userId) => {
	let allProfiles = {};
	return SingerServiceProfiles.find({ userId: userId })
		.then((profiles) => {
			if (profiles[0]) {
				allProfiles.singer = profiles[0];
			}
			return MixingServiceProfiles.find({ userId: userId });
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
			return MasteringServiceProfiles.find({ userId: userId });
		})
		.then((profiles) => {
			if (profiles[0]) {
				allProfiles.mastering = profiles[0];
			}
			return StudioMusicianServiceProfiles.find({ userId: userId });
		})
		.then((profiles) => {
			if (profiles[0]) {
				allProfiles.studioMusician = profiles[0];
			}
			return ProducerServiceProfiles.find({ userId: userId });
		})
		.then((profiles) => {
			if (profiles[0]) {
				allProfiles.producer = profiles[0];
			}
			return SongwriterServiceProfiles.find({ userId: userId });
		})
		.then((profiles) => {
			if (profiles[0]) {
				allProfiles.songwriter = profiles[0];
			}
			return allProfiles;
		})
		.catch((err) => next(err));
};
