const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shared = required('./sharedSubSchemas.js');

const studioMusicianSchema = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		instruments: {
			type: Array,
			default: [],
		},
		dynamicsConfidenceRatings: {
			type: shared.dynamicsConfidenceRatings,
			default: () => ({}),
		},
		pricing: {
			type: shared.pricing,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	}
);

const StudioMusicianServiceProfile = mongoose.model('StudioMusicianServiceProfile', studioMusicianSchema);

module.exports = StudioMusicianServiceProfile;
