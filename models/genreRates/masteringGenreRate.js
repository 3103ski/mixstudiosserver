const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const masteringGenreRate = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		masteringPricingProfileId: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
		},
		rate: {
			type: Currency,
			min: 0,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const MasteringGenreRate = mongoose.model('MasteringGenreRate', masteringGenreRate);
module.exports = MasteringGenreRate;
