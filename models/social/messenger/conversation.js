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
		latestMessage: {},

		notifications: [
			{
				type: Schema.Types.ObjectId,
				ref: 'MessageNotification',
			},
		],
	},
	{
		timestamps: true,
	}
);

conversationSchema
	.pre('findById', Populate('notifications'))
	.pre('findOne', Populate('notifications'))
	.pre('find', Populate('notifications'))
	.pre('findOne', Populate('unreadBy'))
	.pre('find', Populate('unreadBy'));

const Conversation = mongoose.model('Conversation', conversationSchema, 'conversations');

module.exports = Conversation;
