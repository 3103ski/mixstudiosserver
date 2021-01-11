const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const songwriterLyrics = new Schema(
	{
		offersLyrics: {
			type: Boolean,
			default: false,
		},
		emotions: {
			type: Array,
			default: [],
		},
	},
	{
		_id: false,
	}
);

const songwriterMusic = new Schema(
	{
		isOfferingMusic: {
			type: Boolean,
			default: false,
		},
		dynamicRating: {
			type: shared.dynamicsConfidenceRatings,
			default: () => ({}),
		},
		contentBoundaries: {
			type: shared.contentBoundaries,
			default: () => ({}),
		},
	},
	{
		_id: false,
	}
);

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
		lyrics: {
			type: songwriterLyrics,
			default: () => ({}),
		},
		music: {
			type: songwriterMusic,
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

const SongwriterProfile = mongoose.model('SongwriterProfile', songwriterProfileSchema);

module.exports = SongwriterProfile;
