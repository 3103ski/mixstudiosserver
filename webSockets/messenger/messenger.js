const {
	fetchConversationList,
	searchUsers,
	sendNewMessage,
	loadMessages,
} = require('./eventFunctions');

//•••••••••••••••••••
//  Messenger
//•••••••••••••••••••
const messengerSocketEvents = (userId, socket, io, callback) => {
	console.log(`${socket.id} CONNECTED`);
	// console.log('im the ROOMS: ', socket.rooms);

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

	socket.on('find_recipient', ({ recipient, senderId }, callback) => {
		searchUsers({ recipient, senderId }, callback);
	});

	socket.on('send_new_message', ({ message }, callback) => {
		sendNewMessage({ message }, callback).then(
			({ newMessage, updatedConversation, firstMessage, newConversation }) => {
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
