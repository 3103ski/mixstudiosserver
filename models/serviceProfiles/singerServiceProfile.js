const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const singerProfileSchema = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		isRapper: {
			type: Boolean,
			default: false,
		},
		isSinger: {
			type: Boolean,
			default: false,
		},
		rappingStyles: {
			type: Array,
			default: [],
		},
		singingRanges: {
			type: Array,
			default: [],
		},
		vocalEffects: {
			type: Array,
			default: [],
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

const SingerProfile = mongoose.model('SingerProfile', singerProfileSchema);

module.exports = SingerProfile;
