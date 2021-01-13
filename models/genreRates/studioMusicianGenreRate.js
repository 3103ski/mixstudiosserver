const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const studioMusicianGenreRate = new Schema(
	{
		studioMusicianPricingProfileId: {
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
	},
	{
		timestamps: true,
	}
);

const StudioMusicianGenreRate = mongoose.model('StudioMusicianGenreRate', studioMusicianGenreRate);
module.exports = StudioMusicianGenreRate;
