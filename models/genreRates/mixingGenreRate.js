const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const genre = new Schema(
	{
		upToFiveTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToTenTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToTwentyTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToThirtyTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToFortyFiveTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToSixtyTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToSeventyTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
		upToNinetyTracks: {
			type: Currency,
			default: null,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const mixingGenreRate = new Schema(
	{
		pricingProfileId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
		},
		isConfidentRate: {
			type: Boolean,
			default: false,
		},
		rate: {
			type: genre,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	}
);

const MixingGenreRate = mongoose.model('MixingGenreRate', mixingGenreRate);
module.exports = MixingGenreRate;
