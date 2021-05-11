const Conversation = require('../../models/social/messenger/conversation');
const Message = require('../../models/social/messenger/message');
const UserProfile = require('../../models/users/userProfile');
const ObjectId = require('mongoose').Types.ObjectId;

const fetchUserConversations = ({ userId }, callback) => {
	return Conversation.find({ recipientIds: { $in: [userId] } })
		.then((userConversations) => {
			const rooms =
				userConversations.length > 0
					? userConversations.map((convo) => convo.socketRoomId)
					: [];
			return { rooms, userConversations };
		})
		.catch((error) => callback({ error }));
};

const fetchConversation = ({ convoId }, callback) => {
	return Conversation.find({ _id: ObjectId(convoId) })
		.then((conversations) => {
			if (conversations[0]) {
				const conversation = conversations[0];
				console.log('server sending back this UPDATED conversation', conversation);
				console.log('using: ', callback);
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

const sendNewMessage = ({ message, socketRoomId, socket }, callback) => {
	if (message.conversationId !== '') {
		return Conversation.find({ _id: ObjectId(message.conversationId) })
			.then((results) => {
				if (results[0]) {
					console.log('found EXISTING conversation');
					return Message.create(message).then((newMsg) => {
						results[0].latestMessage = newMsg;
						results[0].messages.push(newMsg._id);
						results[0].save();

						newMsg.conversationId = results[0]._id.toString();
						newMsg.save();
						return { updatedConversation: results[0] };
					});
				}
			})
			.catch((error) => callback({ error }));
	} else {
		return Conversation.find({ recipientIds: { $all: [message.recipientIds] } })
			.then((results) => {
				if (results[0]) {
					console.log('found EXISTING conversation');
					return Message.create(message).then((newMsg) => {
						results[0].latestMessage = newMsg;
						results[0].messages.push(newMsg._id);
						results[0].save();
						newMsg.conversationId = results[0]._id.toString();
						newMsg.save();

						return { updatedConversation: results[0] };
					});
				} else {
					return Conversation.create({
						socketRoomId,
						recipientIds: message.recipientIds,
						subscribers: message.subscribers,
						recipients: message.subscribers,
					})
						.then((newConvo) => {
							return Message.create(message).then((newMsg) => {
								newConvo.latestMessage = newMsg;
								newConvo.messages.push(newMsg._id);
								newConvo.save();
								newMsg.conversationId = newConvo._id.toString();
								newMsg.save();

								return { newConversation: newConvo };
							});
						})
						.catch((error) => console.log('We had an error: ', error));
				}
			})
			.catch((error) => console.log('the find had an error: ', error));
	}
	// callback({ message });
};

module.exports = { fetchUserConversations, searchUsers, sendNewMessage, fetchConversation };
