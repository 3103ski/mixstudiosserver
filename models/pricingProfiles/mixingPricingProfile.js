const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateBrackets = new Schema(
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
	},
	{
		_id: false,
	}
);

const genre = new Schema(
	{
		isFlatRate: {
			type: Boolean,
			default: false,
		},
		flatRate: {
			type: rateBrackets,
			default: () => ({}),
		},
		genreRates: {
			type: Array,
			default: [], // populate on client side from seperate endpoint
		},
	},
	{
		timestamps: true,
		_id: false,
	}
);

const extraServiceRates = new Schema(
	{
		drumReplacement: {
			type: Currency,
			min: 0,
		},
		manualPitchCorrection: {
			type: Currency,
			min: 0,
		},
		autoPitchCorrection: {
			type: Currency,
			min: 0,
		},
		replay: {
			type: Currency,
			min: 0,
		},
		mixingAcousticDrums: {
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
		title: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		mixingServiceProfileId: {
			type: String,
			required: true,
		},
		isFlatRate: false,
		flatRate: {
			type: rateBrackets,
			default: () => ({}),
		},
		hasConfidentFlatRate: {
			type: Boolean,
			default: false,
		},
		hasGenreFlateRate: {
			type: Boolean,
			default: false,
		},
		addMasteringRate: {
			type: Currency,
			min: 0,
		},
		extraServiceRates: {
			type: extraServiceRates,
			default: () => ({}),
		},
		confidentGenres: {
			type: genre,
			default: () => ({}),
		},
		lessExperiencedGenres: {
			type: genre,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	}
);

const MixingPricingProfile = mongoose.model('MixingPricingProfile', mixingPricingProfile);
module.exports = MixingPricingProfile;
