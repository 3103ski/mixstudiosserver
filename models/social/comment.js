const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
		likes: {
			type: Array,
			default: [
				{
					type: Schema,
					ref: 'Like',
				},
			],
		},
		tags: {
			type: Array,
			default: [],
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
		isCommentReply: {
			type: Boolean,
			default: false,
		},
		replies: {
			type: Array,
			default: [{ type: Schema, ref: 'Comment' }],
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
