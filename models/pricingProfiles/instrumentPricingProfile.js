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
		genreRates: {
			type: Array,
			default: [], // populate on client side from seperate endpoint
		},
	},
	{
		_id: false,
	}
);

const instrumentPricingProfile = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		instrument: {
			type: String,
			required: true,
		},
		studioMusicianServiceProfileId: {
			type: String,
			required: true,
		},
		isFlatRate: {
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
		perSongRate: {
			type: Currency,
			default: null,
			min: 0,
		},
		perInstrumentRate: {
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

const InstrumentPricingProfile = mongoose.model('InstrumentPricingProfile', instrumentPricingProfile);
module.exports = InstrumentPricingProfile;
