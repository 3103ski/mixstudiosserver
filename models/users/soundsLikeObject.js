const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soundsLikeObjectSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
	},
	{
		timestamps: true,
	}
);

const SoundsLikeObject = mongoose.model('SoundsLikeObject', soundsLikeObjectSchema);

module.exports = SoundsLikeObject;
