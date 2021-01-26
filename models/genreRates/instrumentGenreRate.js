const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const instrumentGenreRate = new Schema(
	{
		instrumentPricingProfileId: {
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
		flatRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		perPartRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		perInstrumentRate: {
			type: Currency,
			default: null,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

const InstrumentGenreRate = mongoose.model('InstrumentGenreRate', instrumentGenreRate);
module.exports = InstrumentGenreRate;
