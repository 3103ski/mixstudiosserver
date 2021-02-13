const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const singerProfileSchema = new Schema(
	{
		userId: {
			required: true,
			type: String,
		},
		serviceType: {
			type: String,
			default: 'singer',
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
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const SingerProfile = mongoose.model('SingerProfile', singerProfileSchema);

module.exports = SingerProfile;
