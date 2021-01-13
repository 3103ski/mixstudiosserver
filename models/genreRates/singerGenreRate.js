const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const singerGenreRate = new Schema(
	{
		singerPricingProfileId: {
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
		isFlateRate: {
			type: Boolean,
			default: false,
		},
		flatRate: {
			type: Currency,
			default: 0,
			min: 0,
		},
		leadVocalRate: {
			type: Currency,
			default: 0,
			min: 0,
		},
		perPartRate: {
			type: Currency,
			default: 0,
			min: 0,
		},
		backgroundVocalRate: {
			type: Currency,
			default: 0,
			min: 0,
		},
		isConfidentRate: {
			type: Boolean,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const SingerGenreRate = mongoose.model('SingerGenreRate', singerGenreRate);
module.exports = SingerGenreRate;
