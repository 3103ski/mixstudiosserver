const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInstrumentProfile = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		skillLevel: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		yearsPlaying: {
			type: Number,
			min: 1,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const UserInstrumentProfile = mongoose.model('UserInstrumentProfile', userInstrumentProfile);

module.exports = UserInstrumentProfile;
