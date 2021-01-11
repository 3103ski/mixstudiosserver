const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shared = require('./sharedSubSchemas');

const masteringMethods = new Schema(
	{
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
	},
	{
		_id: false,
	}
);

const extraMasteringServices = new Schema(
	{
		twoStem: {
			type: Boolean,
			default: false,
		},
		fourStem: {
			type: Boolean,
			default: false,
		},
		eightStem: {
			type: Boolean,
			default: false,
		},
		digitalThroughAnalog: {
			type: Boolean,
			default: false,
		},
	},
	{
		_id: false,
	}
);

const masteringProfileSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		masteringMethods: {
			type: masteringMethods,
			default: () => ({}),
		},
		extraMasteringServices: {
			type: extraMasteringServices,
			default: () => ({}),
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

const MasteringProfile = mongoose.model('MasteringProfile', masteringProfileSchema);

module.exports = MasteringProfile;
