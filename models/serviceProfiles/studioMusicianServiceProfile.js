const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const studioMusicianSchema = new Schema(
	{
		userId: {
			type: String,
		},
		serviceType: {
			type: String,
			default: 'studio musician',
		},
		instruments: {
			type: Array,
			default: [],
		},
		dynamicsConfidenceRatings: shared.dynamicsConfidenceRatings,
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const StudioMusicianServiceProfile = mongoose.model(
	'StudioMusicianServiceProfile',
	studioMusicianSchema
);

module.exports = StudioMusicianServiceProfile;
