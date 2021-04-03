const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateStructure = new Schema(
	{
		twoStem: {
			type: Currency,
			min: 0,
		},
		fourStem: {
			type: Currency,
			min: 0,
		},
		eightStem: {
			type: Currency,
			min: 0,
		},
		analog: {
			type: Currency,
			min: 0,
		},
		digital: {
			type: Currency,
			min: 0,
		},
		hybrid: {
			type: Currency,
			min: 0,
		},
		flatRate: {
			type: Currency,
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
		ratesAreBySong: {
			type: Boolean,
		},
		ratesAreByConfidence: {
			type: Boolean,
			default: null,
		},
		ratesAreByGenre: {
			type: Boolean,
			default: null,
		},
		bySongRates: {
			type: rateStructure,
			default: {},
		},
		confidenceRates: {
			confidentRates: {
				type: rateStructure,
				default: {},
			},
			lessExperiencedRates: {
				type: rateStructure,
				default: {},
			},
		},
		startingAt: {
			type: Currency,
			min: 0,
		},
		genreRates: {
			type: Array,
			default: [],
		},
		extraServiceRates: {
			type: Object,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

const MasteringPricingProfile = mongoose.model('MasteringPricingProfile', masteringPricingProfile);
module.exports = MasteringPricingProfile;
