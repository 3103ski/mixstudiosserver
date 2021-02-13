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
		lyrics: {
			offersLyrics: {
				type: Boolean,
				default: false,
			},
			emotions: {
				type: Array,
				default: [],
			},
		},
		music: {
			isOfferingMusic: {
				type: Boolean,
				default: false,
			},
			dynamicRating: shared.dynamicsConfidenceRatings,
			contentBoundaries: shared.contentBoundaries,
		},
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const SongwriterProfile = mongoose.model('SongwriterProfile', songwriterProfileSchema);

module.exports = SongwriterProfile;
