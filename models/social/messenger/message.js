const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const messageScehma = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		sender: {},
		todoListId: {
			type: String,
		},
		unreadBy: [{ type: Schema.Types.ObjectId, ref: 'UserProfile' }],
		conversationId: {
			type: String,
		},
		isReply: {
			type: Boolean,
			default: false,
		},
		repliedTo: {
			type: String,
			default: null,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Like',
			},
		],

		recipientIds: [
			{
				type: String,
			},
		],
		subscribers: {
			type: Array,
			default: [],
		},
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
	.pre('find', Populate('likes'));

const Message = mongoose.model('Message', messageScehma, 'messages');

module.exports = Message;
