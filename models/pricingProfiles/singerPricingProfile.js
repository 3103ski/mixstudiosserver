const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateStructure = new Schema(
	{
		flatRate: {
			type: Currency,
			min: 0,
		},
		verseRate: {
			type: Currency,
			min: 0,
		},
		chorusRate: {
			type: Currency,
			min: 0,
		},
		rappingFlatRate: {
			type: Currency,
			min: 0,
		},
		rappingVerse: {
			type: Currency,
			min: 0,
		},
		rappingChorus: {
			type: Currency,
			min: 0,
		},
		singingFlatRate: {
			type: Currency,
			min: 0,
		},
		singingVerse: {
			type: Currency,
			min: 0,
		},
		singingChorus: {
			type: Currency,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const singerPricingProfile = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		singerServiceProfileId: {
			type: String,
			required: true,
		},
		ratesAreBySong: {
			type: Boolean,
			default: false,
		},
		ratesAreByConfidence: {
			type: Boolean,
			default: false,
		},
		ratesAreByGenre: {
			type: Boolean,
			default: false,
		},
		bySongRates: {
			type: rateStructure,
			default: {},
		},
		startingAt: {
			type: Currency,
			min: 0,
		},
		confidenceRates: {
			confidentRates: {
				type: rateStructure,
				default: {},
			},
			lessExperiencedRates: {
				type: rateStructure,
				default: {},
			},
		},
		genreRates: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const SingerPricingProfile = mongoose.model('SingerPricingProfile', singerPricingProfile);
module.exports = SingerPricingProfile;
