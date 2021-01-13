const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
		isFlatRate: {
			type: Boolean,
			default: false,
		},
		isLessForBackgroundVocals: {
			type: Boolean,
			default: false,
		},
		isStructuredByPart: {
			type: Boolean,
			default: false,
		},
		hasGenreFlatRate: {
			type: Boolean,
			default: false,
		},
		hasConfidentFlatRate: {
			type: Boolean,
			default: false,
		},
		hasLessExperiencedGenreFlatRate: {
			type: Boolean,
			default: false,
		},
		flatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		confidentGenreFlatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		lessExperiencedGenreFlatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		leadVocalRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		backgroundVocalRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		perPartRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		confidentGenreRates: {
			type: Array,
			default: [], // populate on client side with seperate endpoint
		},
		lessExperiencedGenreRates: {
			type: Array,
			default: [], // populate on client side with seperate endpoint
		},
	},
	{
		timestamps: true,
	}
);

const SingerPricingProfile = mongoose.model('SingerPricingProfile', singerPricingProfile);
module.exports = SingerPricingProfile;
