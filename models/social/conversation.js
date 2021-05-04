const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
	{
		comments: {
			type: Array,
			default: [{ type: Schema, ref: 'Comment' }],
		},
		subscribers: {
			type: Array,
			default: [
				{
					type: Schema.Types.ObjectId,
					ref: 'UserProfile',
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
