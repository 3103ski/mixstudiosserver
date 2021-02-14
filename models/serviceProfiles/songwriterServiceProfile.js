const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const songwriterProfileSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		serviceType: {
			type: String,
			default: 'songwriter',
		},
		doesWriteLyrics: {
			type: Boolean,
			default: false,
		},
		doesWriteMusic: {
			type: Boolean,
			default: false,
		},
		emotionsAndFeelings: {
			type: Array,
			default: [],
		},
		dynamicsConfidenceRatings: shared.dynamicsConfidenceRatings,
		contentBoundaries: shared.contentBoundaries,
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const SongwriterProfile = mongoose.model('SongwriterProfile', songwriterProfileSchema);

module.exports = SongwriterProfile;
