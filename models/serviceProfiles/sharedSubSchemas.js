const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.pricing = new Schema(
	{
		manualQuotingIsActive: {
			type: Boolean,
			default: true,
		},
		pricingProfiles: {
			type: Array,
			default: [],
		},
	},
	{
		_id: false,
	}
);

exports.dynamicsConfidenceRatings = new Schema(
	{
		ambientSoundsAndBeds: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		relaxingAndLaidBack: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		movingAndAwake: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		activeAndFun: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		intenseAndSlow: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		intenseAndFast: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
		excitingAndFun: {
			type: Number,
			default: 3,
			min: 1,
			max: 5,
		},
	},
	{
		_id: false,
	}
);

exports.contentBoundaries = new Schema(
	{
		children: {
			type: Boolean,
			default: false,
		},
		ratedG: {
			type: Boolean,
			default: false,
		},
		ratedPG: {
			type: Boolean,
			default: false,
		},
		ratedPG13: {
			type: Boolean,
			default: false,
		},
		ratedR: {
			type: Boolean,
			default: false,
		},
		ratedX: {
			type: Boolean,
			default: false,
		},
		ratedXXX: {
			type: Boolean,
			default: false,
		},
	},
	{
		_id: false,
	}
);
