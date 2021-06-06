const Conversation = require('../../../models/social/messenger/conversation');
const Message = require('../../../models/social/messenger/message');
const Notification = require('../../../models/notifications/messageNotification');

const ObjectId = require('mongoose').Types.ObjectId;

const sendNewMessage = ({ message }, callback) => {
	if (message.isReply && message.repliedTo) {
		// ****
		// New Message is a message reply
		// ****
		return Message.findOne({ _id: ObjectId(message.repliedTo) }).then((parentMessage) => {
			if (parentMessage) {
				return Message.create(message).then((reply) => {
					parentMessage.messages.push(reply._id);
					parentMessage.save();
					return { reply };
				});
			}
		});
	} else if (message.conversationId) {
		// ****
		// New Message is sent from open conversation
		// ****
		return Conversation.find({ _id: ObjectId(message.conversationId) })
			.then((conversations) => {
				if (conversations[0]) {
					return Message.create(message).then(async (newMessage) => {
						newMessage.conversationId = conversations[0]._id.toString();
						conversations[0].latestMessage = newMessage;
						conversations[0].updatedAt = newMessage.updatedAt;
						const users = newMessage.subscribers.map((user) => user.userId);
						const statusArray = users
							.map((user) => {
								if (user !== newMessage.sender.userId) {
									return createNotificationStatus(user);
								} else {
									return null;
								}
							})
							.filter((status) => status !== null);

						return Notification.create({
							users,
							statusArray,
							conversationId: conversations[0]._id.toString(),
							messageId: newMessage._id.toString(),
						})
							.then(async (notification) => {
								await conversations[0].notifications.push(notification._id);
								await newMessage.save();
								await conversations[0].save();
								return Conversation.findById(conversations[0]._id)
									.then((populatedConvo) => {
										if (populatedConvo) {
											return {
												newMessage,
												updatedConversation: populatedConvo,
											};
										}
									})
									.catch((error) => console.log(error));
							})
							.catch((error) => callback({ error }));
					});
				}
			})
			.catch((error) => callback({ error }));
	} else {
		// ****
		// User tried to start a new conversation that already existed
		// ****
		return Conversation.find({ recipientIds: { $all: [...message.recipientIds] } })
			.then((conversations) => {
				if (
					conversations[0] &&
					conversations[0].recipientIds.length === message.recipientIds.length
				) {
					return Message.create(message)
						.then(async (newMessage) => {
							const users = newMessage.subscribers.map((user) => user.userId);
							newMessage.conversationId = conversations[0]._id.toString();
							conversations[0].latestMessage = newMessage;

							const statusArray = users
								.map((user) => {
									if (user !== newMessage.sender.userId) {
										return createNotificationStatus(user);
									} else {
										return null;
									}
								})
								.filter((status) => status !== null);

							return Notification.create({
								users,
								statusArray,
								conversationId: conversations[0]._id.toString(),
								messageId: newMessage._id.toString(),
							})
								.then(async (notification) => {
									await conversations[0].notifications.push(notification._id);
									await newMessage.save();
									await conversations[0].save();
									return Conversation.findById(conversations[0]._id)
										.then((populatedConvo) => {
											if (populatedConvo) {
												return {
													newMessage,
													updatedConversation: populatedConvo,
												};
											}
										})
										.catch((error) => console.log(error));
								})
								.catch((error) => callback({ error }));
						})
						.catch((error) => callback({ error }));
				} else {
					// ****
					// New Message is a new conversation
					// ****
					return Conversation.create({
						recipientIds: message.recipientIds,
						subscribers: message.subscribers,
						recipients: message.subscribers,
					})
						.then((newConversation) => {
							return Message.create(message)
								.then((newMessage) => {
									const users = newMessage.subscribers.map((user) => user.userId);

									const statusArray = users
										.map((user) => {
											if (user !== newMessage.sender.userId) {
												return createNotificationStatus(user);
											} else {
												return null;
											}
										})
										.filter((status) => status !== null);

									newMessage.conversationId = newConversation._id.toString();
									newConversation.latestMessage = newMessage;

									return Notification.create({
										users,
										statusArray,
										conversationId: newConversation._id.toString(),
										messageId: newMessage._id.toString(),
									})
										.then(async (notification) => {
											await newConversation.notifications.push(
												notification._id
											);
											await newMessage.save();
											await newConversation.save();

											return Conversation.findById(newConversation._id)
												.then((populatedConvo) => {
													if (populatedConvo) {
														return {
															firstMessage: newMessage,
															newConversation: populatedConvo,
														};
													}
												})
												.catch((error) => console.log(error));
										})
										.catch((error) => callback({ error }));
								})
								.catch((error) => callback({ error }));
						})
						.catch((error) => callback({ error }));
				}
			})
			.catch((error) => callback({ error }));
	}
};

//••••••••••••••••
// Manage Conversations
//••••••••••••••••

const fetchConversationList = async ({ userId }, callback) => {
	Conversation.find({ recipientIds: { $in: [userId] } })
		.then(async (conversations) => {
			return conversations;
		})
		.then((conversations) => {
			return callback({ conversations });
		})
		.catch((error) => callback({ error }));
};

const fetchConversation = ({ convoId }, callback) => {
	return Conversation.find({ _id: ObjectId(convoId) })
		.then((conversations) => {
			if (conversations[0]) {
				const conversation = conversations[0];
				return callback({ conversation });
			} else {
				callback({
					error: 'The conversation you are looking for was not found in the database',
				});
			}
		})
		.catch((error) => callback({ error }));
};

const loadMessages = ({ conversationId, userId }, callback) => {
	Notification.find({ conversationId: conversationId }, function (error, notifications) {
		if (error) {
			callback({ error });
		}
		if (notifications) {
			notifications.forEach(function (notification) {
				let updatedStatusArray = notification.statusArray.map((status) => {
					if (status.userId === userId) {
						status.seen = true;
						return status;
					} else {
						return status;
					}
				});
				Notification.updateOne(
					{ _id: notification._id },
					{ $set: { statusArray: updatedStatusArray } }
				).catch((error) => callback({ error }));
			});
		}
	})
		.then(() => {
			Conversation.findOne({ _id: conversationId }).then((conversation) => {
				Message.find({ conversationId: conversationId }).then((messages) => {
					if (messages) {
						callback({ messages, updatedConversation: conversation });
					}
				});
			});
		})
		.catch((error) => callback({ error }));
};

//••••••••••••••••
// Local Utility
//••••••••••••••••

function createNotificationStatus(userId) {
	return {
		userId,
		seen: false,
	};
}

module.exports = {
	fetchConversationList,
	sendNewMessage,
	fetchConversation,
	loadMessages,
};
