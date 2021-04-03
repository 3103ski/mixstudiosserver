const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const masteringProfileSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		serviceType: {
			type: String,
			default: 'mastering',
		},
		masteringMethods: {
			analog: {
				type: Boolean,
				default: false,
			},
			digital: {
				type: Boolean,
				default: false,
			},
			hybrid: {
				type: Boolean,
				deafult: false,
			},
			stemMastering: {
				type: Boolean,
				deafult: false,
			},
		},
		serviceCardPlayer: {
			songOne: {
				type: Object,
				default: null,
			},
			songTwo: {
				type: Object,
				default: null,
			},
			songThree: {
				type: Object,
				default: null,
			},
		},
		extraMasteringServices: {
			extraPasses: {
				type: Boolean,
				default: false,
			},
			digitalThroughAnalog: {
				type: Boolean,
				default: false,
			},
		},
		pricing: shared.pricing,
	},
	{
		timestamps: true,
	}
);

const MasteringProfile = mongoose.model('MasteringProfile', masteringProfileSchema);

module.exports = MasteringProfile;
