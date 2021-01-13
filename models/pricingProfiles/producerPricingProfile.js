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
		flateRateSmallProduction: {
			type: Currency,
			min: 0,
			default: null,
		},
		flateRateLargeProduction: {
			type: Currency,
			min: 0,
			default: null,
		},
		hasContributionRate: {
			type: Boolean,
			default: false,
		},
		contributionRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		genreRates: {
			type: Array,
			default: [], // Populate on client side from seperate endpoint
		},
	},
	{
		_id: false,
	}
);

const producerPricingProfile = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		producerServiceProfileId: {
			type: String,
			required: true,
		},
		isFlatRate: {
			type: Boolean,
			default: false,
		},
		hasFlatContributionRate: {
			type: Boolean,
			default: false,
		},
		hasFromScratchRate: {
			type: Boolean,
			default: false,
		},
		hasGenreFlateRate: {
			type: Boolean,
			default: false,
		},
		hasConfidentFlatRate: {
			type: Boolean,
			default: false,
		},
		flatRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		flateContributionRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		fromScratchRate: {
			type: Currency,
			min: 0,
			default: null,
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

const ProducerPricingProfile = mongoose.model('ProducerPricingProfile', producerPricingProfile);
module.exports = ProducerPricingProfile;
