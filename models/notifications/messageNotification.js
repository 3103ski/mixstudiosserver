const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../util/autoPopulate');

const messageNotificationSchema = new Schema(
	{
		users: { type: Array, default: [] },
		statusArray: { type: Array, default: [] },
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
		},
		messageId: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

messageNotificationSchema.pre('findOne', Populate('messageId')).pre('find', Populate('messageId'));

const MessageNotifications = mongoose.model(
	'MessageNotification',
	messageNotificationSchema,
	'messageNotifications'
);

module.exports = MessageNotifications;
