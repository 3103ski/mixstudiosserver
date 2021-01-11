const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const extraServices = new Schema(
	{
		drumReplacement: {
			type: Boolean,
			default: false,
		},
		manualPitchCorrection: {
			type: Boolean,
			default: false,
		},
		autoPitchCorrection: {
			type: Boolean,
			default: false,
		},
		replay: {
			type: Boolean,
			default: false,
		},
		mixingActousticDrums: {
			type: Boolean,
			default: false,
		},
	},
	{
		_id: false,
	}
);

const mixingProfileSchema = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		extraServices: {
			type: extraServices,
			default: () => ({}),
		},
		alsoDoesMastering: {
			type: Boolean,
			default: false,
		},
		pricing: {
			type: shared.pricing,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	}
);

const MixingProfile = mongoose.model('MixingProfile', mixingProfileSchema);

module.exports = MixingProfile;
