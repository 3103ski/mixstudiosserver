const Conversation = require('../../models/social/messenger/conversation');
const Message = require('../../models/social/messenger/message');
const UserProfile = require('../../models/users/userProfile');
const ObjectId = require('mongoose').Types.ObjectId;

const fetchConversationList = ({ userId }, callback) => {
	console.log('In the events');
	return Conversation.find({ recipientIds: { $in: [userId] } })
		.then((conversations) => {
			// console.log('about to send back a convo list', conversationList);
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
				console.log(`I looked but didn't find the conversation to populate`, conversations);
			}
		})
		.catch((error) => callback({ error }));
};

const searchUsers = ({ recipient }, callback) => {
	function makeReg(text) {
		return new RegExp(`${text}`, 'i');
	}

	if (recipient.length >= 3) {
		UserProfile.find({
			$or: [
				{ 'userInfo.email': makeReg(recipient) },
				{ 'userInfo.lastName': makeReg(recipient) },
				{ 'userInfo.firstName': makeReg(recipient) },
				{ 'userInfo.firstName': makeReg(recipient) },
				{ username: makeReg(recipient) },
			],
		}).then((results) => {
			if (results[0]) {
				const userInfos = results.map((result) => {
					return {
						firstName: result.userInfo.firstName,
						lastName: result.userInfo.lastName,
						email: result.userInfo.email,
						googleAvatar: result.userInfo.googleAvatar,
						facebookAvatar: result.userInfo.facebookAvatar,
						avatar: result.userInfo.avatar,
						spotifyAvatar: result.userInfo.spotifyAvatar,
						languages: result.userInfo.languages,
						username: result.username,
						userId: result._id,
					};
				});
				callback({ results: userInfos });
			} else {
				callback({ results: [] });
			}
		});
	} else {
		return callback({ results: [] });
	}
};

const sendNewMessage = ({ message }, callback) => {
	if (message.isReply && message.repliedTo) {
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
		{
			return Conversation.find({ _id: ObjectId(message.conversationId) })
				.then((conversations) => {
					if (conversations[0]) {
						return Message.create(message).then((newMessage) => {
							newMessage.conversationId = conversations[0]._id.toString();
							conversations[0].latestMessage = newMessage;
							conversations[0].updatedAt = newMessage.updatedAt;
							newMessage.save();
							conversations[0].save();
							return { newMessage, updatedConversation: conversations[0] };
						});
					}
				})
				.catch((error) => callback({ error }));
		}
	} else {
		return Conversation.find({ recipientIds: { $all: [message.recipientIds] } })
			.then((conversations) => {
				if (conversations[0]) {
					return Message.create(message)
						.then((newMessage) => {
							newMessage.conversationId = conversations[0]._id.toString();
							conversations[0].latestMessage = newMessage;
							newMessage.save();
							conversations[0].save();
							return { newMessage, updatedConversation: conversations[0] };
						})
						.catch((error) => callback({ error }));
				} else {
					return Conversation.create({
						recipientIds: message.recipientIds,
						subscribers: message.subscribers,
						recipients: message.subscribers,
					})
						.then((newConversation) => {
							console.log('made a new convo');
							return Message.create(message)
								.then((newMessage) => {
									newMessage.conversationId = newConversation._id.toString();
									newConversation.latestMessage = newMessage;
									newMessage.save();
									newConversation.save();
									return { firstMessage: newMessage, newConversation };
								})
								.catch((error) => callback({ error }));
						})
						.catch((error) => callback({ error }));
				}
			})
			.catch((error) => callback({ error }));
	}
};

const loadMessages = ({ conversationId }, callback) => {
	console.log('EVENET_FUNCTION :: loadMessages :: conversationId ', conversationId);
	return Message.find({ conversationId: conversationId })
		.then((messages) => {
			console.log(`Message count for convo ${messages[0].conversationId}: `, messages.length);
			if (messages) {
				return callback({ messages });
			}
		})
		.catch((error) => callback({ error }));
};

module.exports = {
	fetchConversationList,
	searchUsers,
	sendNewMessage,
	fetchConversation,
	loadMessages,
};
