const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const conversationSchema = new Schema(
	{
		socketRoomId: {
			type: String,
			required: true,
		},
		subscribers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'UserProfile',
			},
		],
		recipients: [
			{
				type: Schema.Types.ObjectId,
				ref: 'UserProfile',
			},
		],
		messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
		latestMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	},
	{
		timestamps: true,
	}
);

conversationSchema
	.pre('findOne', Populate('messages'))
	.pre('find', Populate('messages'))
	.pre('findOne', Populate('latestMessage'))
	.pre('find', Populate('latestMessage'))
	.pre('findOne', Populate('unreadBy'))
	.pre('find', Populate('unreadBy'));

const Conversation = mongoose.model('Conversation', conversationSchema, 'conversations');

module.exports = Conversation;
