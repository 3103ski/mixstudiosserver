// Event Functions
const {
	sendNewMessage,
	loadMessages,
	fetchConversationList,
} = require('./messengerEventFunctions/messageEventFunctions');

const {
	dismissConversationNotifications,
	fetchNewMessageCount,
} = require('./messengerEventFunctions/notificationsEventFunctions');

const {
	pinMessage,
	unpinMessage,
	fetchPinCollections,
} = require('./messengerEventFunctions/pinEventFunctions');

const { searchUsers } = require('./messengerEventFunctions/utilityEventFunctions');

//•••••••••••••••••••
//  Messenger
//•••••••••••••••••••
const messengerSocketEvents = (userId, socket, io, callback) => {
	//================
	// User Connects to Messenger
	//================
	console.log(`${socket.id} CONNECTED`);

	// Create room for userId for location to direct new conversations
	socket.join(userId.toString());

	callback({
		serverMessage: `The messenger has been connected to socket: ${socket.id}`,
		socketId: socket.id,
		status: 'connected',
	});

	socket.on('join_conversation', ({ conversationId }, callback) => {
		if (![...socket.rooms].includes(conversationId)) {
			socket.join(conversationId);
		}

		callback({ joinedRoom: conversationId });
	});

	//•••••••••••••••••••••
	// Message Events
	//•••••••••••••••••••••

	socket.on('load_conversation_list', ({ userId }, callback) => {
		return fetchConversationList({ userId }, callback);
	});

	socket.on('load_conversation', ({ conversationId, userId }, callback) => {
		loadMessages({ conversationId, userId }, callback);
	});

	socket.on('send_new_message', ({ message }, callback) => {
		sendNewMessage({ message }, callback).then(
			({ newMessage, updatedConversation, firstMessage, newConversation, reply }) => {
				if (newMessage && updatedConversation) {
					io.to(message.conversationId).emit('message_update', {
						conversation: updatedConversation,
						message: newMessage,
						emitOrigin: socket.id,
					});
					return callback({
						updatedConversation,
						newMessage,
					});
				} else if (firstMessage && newConversation) {
					socket.join(newConversation._id.toString());
					newConversation.subscribers.forEach(function (room) {
						io.sockets.in(room.userId).emit('message_update', {
							message: firstMessage,
							newConversation,
							emitOrigin: socket.id,
						});
					});
					return callback({
						newMessage: firstMessage,
						newConversation,
					});
				} else if (reply) {
					return callback({
						reply,
					});
				}
			}
		);
	});

	//•••••••••••••••••••••
	// Pin Events
	//•••••••••••••••••••••

	socket.on('pin_message', ({ payload }, callback) => {
		pinMessage({ payload }, callback)
			.then(({ collection, newPinCollection, newPin }) => {
				if (collection) {
					return callback({ collection, newPin });
				}
				if (newPinCollection) {
					return callback({ newPinCollection, newPin });
				}
			})
			.catch((error) => callback({ error }));
	});

	socket.on('unpin_message', ({ messageId, userId }, callback) => {
		unpinMessage({ messageId, userId }, callback);
	});

	socket.on('fetch_pin_collections', ({ userId }, callback) => {
		fetchPinCollections({ userId }, callback);
	});

	//•••••••••••••••••••••
	// Notification Events
	//•••••••••••••••••••••

	socket.on('fetch_new_message_count', ({ userId }, callback) => {
		fetchNewMessageCount({ userId }, callback);
	});

	socket.on('dismiss_conversation_notifications', ({ conversationId, userId }, callback) => {
		dismissConversationNotifications({ conversationId, userId }, callback);
	});

	//•••••••••••••••••••••
	// Utility Events
	//•••••••••••••••••••••

	socket.on('find_recipient', ({ recipient, senderId }, callback) => {
		searchUsers({ recipient, senderId }, callback);
	});

	//=================
	// User leaves messenger page
	//=================
	return socket.on('close_messenger', (callback) => {
		callback({
			serverMessage: `The messenger has been DISCONNECTED from socket: ${socket.id}`,
			status: 'not connected',
		});
		return socket.disconnect();
	});
};

module.exports = { messengerSocketEvents };
