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
	socket.join(userId.toString());
	console.log('im the ROOMS: ', socket.rooms);
	callback({
		serverMessage: `The messenger has been connected to socket: ${socket.id}`,
		status: 'connected',
	});

	socket.on('load_conversation_list', ({ userId }, callback) => {
		return fetchConversationList({ userId }, callback);
	});

	socket.on('load_messages', ({ conversationId }, callback) => {
		loadMessages({ conversationId }, callback);
	});

	socket.on('join_conversation', ({ conversationId }, callback) => {
		if (![...socket.rooms].includes(conversationId)) {
			socket.join(conversationId);
			callback({ confirmation: `Joined: ${conversationId}` });
		}
	});

	socket.on('conversation_select', ({ conversationId }) => {
		io.to(socket.id).emit('conversation_selection', { selectConversation: conversationId });
	});

	socket.on('find_recipient', ({ recipient, senderId }, callback) => {
		searchUsers({ recipient, senderId }, callback);
	});

	socket.on('send_new_message', ({ message }, callback) => {
		sendNewMessage({ message }, callback).then(
			({ newMessage, updatedConversation, firstMessage, newConversation }) => {
				if (newMessage && updatedConversation) {
					console.log('EMITING UPDATE');
					return io.to(message.conversationId).emit('message_update', {
						updatedConversation,
						newMessage,
					});
				} else if (firstMessage && newConversation) {
					socket.join(newConversation._id.toString());
					return newConversation.subscribers.forEach(function (room) {
						console.log('IO emmitting to :: ', room);
						io.sockets.in(room.userId).emit('message_update', {
							firstMessage,
							newConversation,
						});
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
