const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const serviceAlphaProfileSchema = new Schema(
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
		dynamicsConfidenceRatings: shared.dynamicsConfidenceRatings,
		contentBoundaries: shared.contentBoundaries,
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const ServiceAlphaProfile = mongoose.model('ServiceAlphaProfile', serviceAlphaProfileSchema);

module.exports = ServiceAlphaProfile;
