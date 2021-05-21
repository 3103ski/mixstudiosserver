const {
	fetchConversationList,
	searchUsers,
	sendNewMessage,
	loadMessages,
	fetchPinCollections,
	pinMessage,
} = require('./eventFunctions');

//•••••••••••••••••••
//  Messenger
//•••••••••••••••••••
const messengerSocketEvents = (userId, socket, io, callback) => {
	console.log(`${socket.id} CONNECTED`);
	socket.join(userId.toString());

	callback({
		serverMessage: `The messenger has been connected to socket: ${socket.id}`,
		socketId: socket.id,
		status: 'connected',
	});

	socket.on('load_conversation_list', ({ userId }, callback) => {
		return fetchConversationList({ userId }, callback);
	});

	socket.on('load_conversation', ({ conversationId }, callback) => {
		loadMessages({ conversationId }, callback);
	});

	socket.on('join_conversation', ({ conversationId }, callback) => {
		if (![...socket.rooms].includes(conversationId)) {
			socket.join(conversationId);
		}
		callback({ joinedRoom: conversationId });
	});

	socket.on('pin_message', ({ payload }, callback) => {
		pinMessage({ payload }, callback).then(({ collection, newPinCollection, newPin }) => {
			if (collection) {
				return callback({ collection, newPin });
			}
			if (newPinCollection) {
				return callback({ newPinCollection, newPin });
			}
		});
	});

	socket.on('fetch_pin_collections', ({ userId }, callback) => {
		fetchPinCollections({ userId }, callback);
	});

	socket.on('find_recipient', ({ recipient, senderId }, callback) => {
		searchUsers({ recipient, senderId }, callback);
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
							conversation: newConversation,
							emitOrigin: socket.id,
						});
					});
					return callback({
						newMessage: firstMessage,
						newConversation,
					});
				} else if (reply) {
					console.log('Sending this reply: ', reply);
					return callback({
						reply,
					});
				}
			}
		);
	});

	// User leaves messenger page
	return socket.on('close_messenger', (callback) => {
		callback({
			serverMessage: `The messenger has been DISCONNECTED from socket: ${socket.id}`,
			status: 'not connected',
		});
		return socket.disconnect();
	});
};

module.exports = { messengerSocketEvents };
