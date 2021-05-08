const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const messageScehma = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
		todoListId: {
			type: String,
		},
		unreadBy: [{ type: Schema.Types.ObjectId, ref: 'UserProfile' }],
		conversationId: {
			type: String,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Like',
			},
		],
		subscribers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'UserProfile',
			},
		],
		messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
	},
	{
		timestamps: true,
	}
);

messageScehma
	.pre('findOne', Populate('messages'))
	.pre('find', Populate('messages'))
	.pre('findOne', Populate('likes'))
	.pre('find', Populate('likes'))
	.pre('findOne', Populate('unreadBy'))
	.pre('find', Populate('unreadBy'));

const Message = mongoose.model('Message', messageScehma, 'messages');

module.exports = Message;
