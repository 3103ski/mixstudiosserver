const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const conversationSchema = new Schema(
	{
		subscribers: {
			type: Array,
			default: [],
		},
		recipients: {},
		subscribers: { type: Array, default: [] },
		recipientIds: { type: Array, default: [], required: true },
		// messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
		latestMessage: {},
	},
	{
		timestamps: true,
	}
);

conversationSchema
	.pre('findOne', Populate('messages'))
	.pre('find', Populate('messages'))
	.pre('findOne', Populate('unreadBy'))
	.pre('find', Populate('unreadBy'));

const Conversation = mongoose.model('Conversation', conversationSchema, 'conversations');

module.exports = Conversation;
