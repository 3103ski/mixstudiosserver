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
		vocalsRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		smallIdeaRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		largeIdeaRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		genreRates: {
			type: Array,
			default: [], // populate on client side with seperate endpoint
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
		isFlatRate: {
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
		flatRate: {
			type: Currency,
			default: null,
			min: 0,
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

const SongwriterPricingProfile = mongoose.model('SongwriterPricingProfile', songwriterPricingProfile);
module.exports = SongwriterPricingProfile;
