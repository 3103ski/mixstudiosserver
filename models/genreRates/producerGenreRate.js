const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const producerGenreRate = new Schema(
	{
		producerPricingProfileId: {
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
		contributionRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		smallProductionRate: {
			type: Currency,
			min: 0,
			default: null,
		},
		largeProductionRate: {
			type: Currency,
			min: 0,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const ProducergenreRate = mongoose.model('ProducerGenreRate', producerGenreRate);
module.exports = ProducergenreRate;
