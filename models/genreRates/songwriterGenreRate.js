const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const songwriterGenreRate = new Schema(
	{
		songwriterPricingProfileId: {
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
			default: null,
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
	},
	{
		timestamps: true,
	}
);

const SongwriterGenreRate = mongoose.model('SongwriterGenreRate', songwriterGenreRate);
module.exports = SongwriterGenreRate;
