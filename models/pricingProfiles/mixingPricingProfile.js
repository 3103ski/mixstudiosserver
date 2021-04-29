const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateStructure = new Schema(
	{
		upToFiveTracks: {
			type: Currency,
			min: 0,
		},
		upToTenTracks: {
			type: Currency,
			min: 0,
		},
		upToTwentyTracks: {
			type: Currency,
			min: 0,
		},
		upToThirtyTracks: {
			type: Currency,
			min: 0,
		},
		upToFortyFiveTracks: {
			type: Currency,
			min: 0,
		},
		upToSixtyTracks: {
			type: Currency,
			min: 0,
		},
		upToSeventyTracks: {
			type: Currency,
			min: 0,
		},
		upToNinetyTracks: {
			type: Currency,
			min: 0,
		},
		globalRate: {
			type: Currency,
			min: 0,
		},
		lowAvg: {
			type: Currency,
			min: 0,
		},
		avgRate: {
			type: Currency,
			min: 0,
		},
		avgHigh: {
			type: Currency,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const mixingPricingProfile = new Schema(
	{
		userId: {
			type: String,
		},
		title: {
			type: String,
			required: true,
		},
		mixingServiceProfileId: {
			type: String,
			required: true,
		},
		ratesAreBySize: {
			type: Boolean,
			default: null,
		},
		ratesAreByGenre: {
			type: Boolean,
			default: null,
		},
		ratesAreByConfidence: {
			type: Boolean,
			default: null,
		},
		confidenceRates: {
			lessExperiencedRates: {
				type: rateStructure,
				default: {},
			},
			confidentRates: {
				type: rateStructure,
				default: {},
			},
		},
		ratesBySize: {
			type: rateStructure,
			default: {},
		},
		genreRates: {
			type: Array,
			default: [],
		},
		globaleFlatRate: {
			type: Number,
			default: null,
		},
		genreAverages: {
			type: Array,
			default: null,
		},
		extraServicesRates: {
			type: Object,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

const MixingPricingProfile = mongoose.model('MixingPricingProfile', mixingPricingProfile);
module.exports = MixingPricingProfile;
