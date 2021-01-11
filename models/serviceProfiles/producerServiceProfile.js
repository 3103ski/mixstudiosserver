const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const producerProfileSchema = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		emotionsAndFeelings: {
			type: Array,
			default: [],
		},
		dynamicsConfidenceRatings: {
			type: shared.dynamicsConfidenceRatings,
			default: () => ({}),
		},
		contentBoundaries: {
			type: shared.contentBoundaries,
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

const ProducerProfile = mongoose.model('ProducerProfile', producerProfileSchema);

module.exports = ProducerProfile;
