const Conversation = require('../../models/social/messenger/conversation');
const Message = require('../../models/social/messenger/message');
const PinCollection = require('../../models/social/messenger/pinCollection');
const Pin = require('../../models/social/messenger/pin');

const UserProfile = require('../../models/users/userProfile');
const ObjectId = require('mongoose').Types.ObjectId;

const fetchConversationList = ({ userId }, callback) => {
	return Conversation.find({ recipientIds: { $in: [userId] } })
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
				console.log(`I looked but didn't find the conversation to populate`, conversations);
				callback({
					error: 'The conversation you are looking for was not found in the database',
				});
			}
		})
		.catch((error) => callback({ error }));
};

const fetchPinCollections = ({ userId }, callback) => {
	return PinCollection.find({ userId: userId })
		.then((collections) => {
			return callback({ pinCollections: collections });
		})
		.catch((err) => callback({ error: err }));
};

const unpinMessage = ({ messageId, userId }, callback) => {
	Pin.find({ message: messageId, userId: userId })
		.then((pinResults) => {
			if (pinResults[0]) {
				const pinToRemove = pinResults[0];
				PinCollection.find({ pins: { $in: [pinToRemove._id] } }).then(
					async (collectionResults) => {
						if (collectionResults[0]) {
							const updatedPins = await collectionResults[0].pins.filter(
								(pin) => pin._id.toString() !== pinToRemove._id.toString()
							);

							console.log('Are these pins correct? ', updatedPins);
							if (updatedPins.length === 0) {
								PinCollection.deleteOne({ _id: collectionResults[0]._id })
									.then((res) => {
										console.log('Deleted collection res: ', res);
										Pin.deleteOne({ _id: pinToRemove._id })
											.then((res) => {
												console.log('This was the res: ', res);
												collectionResults[0].pins = updatedPins;
												callback({
													updatedCollection: collectionResults[0],
													removedPin: pinToRemove,
												});
											})
											.catch((error) => callback({ error }));
									})
									.catch((error) => callback({ error }));
							} else {
								Pin.deleteOne({ _id: pinToRemove._id })
									.then((res) => {
										console.log('This was the res: ', res);
										collectionResults[0].pins = updatedPins;
										collectionResults[0].save();
										callback({
											updatedCollection: collectionResults[0],
											removedPin: pinToRemove,
										});
									})
									.catch((error) => callback({ error }));
							}
						}
					}
				);
			} else {
				callback({
					error: 'The pin you are trying to delete does not exist in the database.',
				});
			}
		})
		.catch((error) => callback({ error }));
};

const pinMessage = ({ payload }, callback) => {
	const { pin, message } = payload;

	return PinCollection.find({ recipientIds: { $all: message.recipientIds }, userId: pin.userId })
		.then((collection) => {
			console.log('Collection results: ', collection);
			console.log('Incoming pin: ', pin);
			if (
				collection[0] &&
				collection[0].recipientIds.length === message.recipientIds.length &&
				collection[0].userId === pin.userId
			) {
				return Pin.create(pin)
					.then((newPin) => {
						collection[0].pins.push(newPin._id);
						collection[0].save();
						return { collection: collection[0], newPin };
					})
					.catch((err) => callback({ error: err }));
			} else {
				return PinCollection.create({
					userId: pin.userId,
					subscribers: message.subscribers,
					recipientIds: message.recipientIds,
				})
					.then((newPinCollection) => {
						return Pin.create(pin).then((newPin) => {
							newPinCollection.pins.push(newPin._id);
							newPinCollection.save();
							return { newPinCollection, newPin };
						});
					})
					.catch((err) => callback({ error: err }));
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
		return Conversation.find({ recipientIds: { $all: message.recipientIds } })
			.then((conversations) => {
				if (
					conversations[0] &&
					conversations[0].recipientIds.length === message.recipientIds.length
				) {
					console.log('This list: ', conversations);
					console.log('These IDs: ', message.recipientIds);
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
	pinMessage,
	fetchPinCollections,
	unpinMessage,
};
