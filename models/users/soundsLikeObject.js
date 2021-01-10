const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soundsLikeObjectSchema = new Schema(
	{
		soundsLike: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const SoundsLikeObject = mongoose.model('SoundsLikeObject', soundsLikeObjectSchema);

module.exports = SoundsLikeObject;
