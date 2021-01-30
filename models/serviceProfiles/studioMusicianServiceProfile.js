const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const studioMusicianSchema = new Schema(
	{
		userId: {
			required: true,
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