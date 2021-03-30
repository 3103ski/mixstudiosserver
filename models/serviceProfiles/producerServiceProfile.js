const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const producerProfileSchema = new Schema(
	{
		userId: {
			type: String,
		},
		serviceType: {
			type: String,
			default: 'producer',
		},
		emotionsAndFeelings: {
			type: Array,
			default: [],
		},
		serviceCardPlayer: {
			songOne: {
				type: Object,
				default: null,
			},
			songTwo: {
				type: Object,
				default: null,
			},
			songThree: {
				type: Object,
				default: null,
			},
		},
		dynamicsConfidenceRatings: shared.dynamicsConfidenceRatings,
		contentBoundaries: shared.contentBoundaries,
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const ProducerProfile = mongoose.model('ProducerProfile', producerProfileSchema);

module.exports = ProducerProfile;
