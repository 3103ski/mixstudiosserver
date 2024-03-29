const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Like = mongoose.model('Like', likeSchema, 'likes');

module.exports = Like;
