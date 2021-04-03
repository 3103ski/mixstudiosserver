const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateStructure = new Schema(
	{
		smallSong: {
			type: Currency,
			default: null,
			min: 0,
		},
		largeSong: {
			type: Currency,
			default: null,
			min: 0,
		},
		flatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const songwriterPricingProfile = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		songwriterServiceProfileId: {
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

const SongwriterPricingProfile = mongoose.model(
	'SongwriterPricingProfile',
	songwriterPricingProfile
);
module.exports = SongwriterPricingProfile;
