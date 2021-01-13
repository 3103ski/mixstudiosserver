const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const genres = new Schema(
	{
		isFlatRate: {
			type: Boolean,
			default: false,
		},
		rate: {
			type: Currency,
			default: null,
			min: 0,
		},
		genreRates: {
			type: Array,
			default: [], // populate from seperate endpoint on client side
		},
	},
	{
		_id: false,
	}
);

const studioMusicianPricingProfile = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		userId: {
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
		hasGenreFlateRate: {
			type: Boolean,
			default: false,
		},
		instrumentFlatRate: {
			type: Boolean,
			default: false,
		},
		perInstrument: {
			type: Boolean,
			default: false,
		},
		perPart: {
			type: Boolean,
			default: false,
		},
		perSongNeeds: {
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
		instrumentPricingProfiles: {
			type: Array,
			default: [], // populate on client side from seperate endpoint
		},
	},
	{
		timestamps: true,
	}
);

const StudioMusicianPricingProfile = mongoose.model('StudioMusicianPricingProfile', studioMusicianPricingProfile);
module.exports = StudioMusicianPricingProfile;
