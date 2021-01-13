const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const genre = new Schema(
	{
		isFlatRate: {
			type: Boolean,
			default: false,
		},
		flatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		genreRates: {
			type: Array,
			default: [], // populate on client side from seperate endpoint
		},
	},
	{
		_id: false,
	}
);

const extraServices = new Schema(
	{
		twoStemMastering: {
			type: Currency,
			default: null,
			min: 0,
		},
		fourStemMastering: {
			type: Currency,
			default: null,
			min: 0,
		},
		eightStemMastering: {
			type: Currency,
			default: null,
			min: 0,
		},
		digitalThroughAnalog: {
			type: Currency,
			default: null,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const masteringPricingProfile = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		masteringServiceProfileId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		isFlatRate: {
			type: Boolean,
			default: null,
		},
		flatRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		extraServices: {
			type: extraServices,
			default: () => ({}),
		},
		hasGenreFlatRate: {
			type: Boolean,
			default: null,
		},
		confidentGenreRates: {
			type: genre,
			default: () => ({}),
		},
		lessExperiencedGenreRates: {
			type: genre,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	}
);

const MasteringPricingProfile = mongoose.model('MasteringPricingProfile', masteringPricingProfile);
module.exports = MasteringPricingProfile;
