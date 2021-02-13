const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const mixingProfileSchema = new Schema(
	{
		userId: {
			type: String,
		},
		serviceType: {
			type: String,
			default: 'mixing',
		},
		extraServices: {
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
			mixingAcousticDrums: {
				type: Boolean,
				default: false,
			},
		},
		alsoDoesMastering: {
			type: Boolean,
			default: false,
		},
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const MixingProfile = mongoose.model('MixingProfile', mixingProfileSchema);

module.exports = MixingProfile;
