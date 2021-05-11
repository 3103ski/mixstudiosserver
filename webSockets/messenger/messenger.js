const {
	fetchUserConversations,
	searchUsers,
	sendNewMessage,
	fetchConversation,
} = require('./eventFunctions');

const messageSocketEvents = (userId, socket, io, callback) => {
	fetchUserConversations({ userId, socket }, callback).then(({ rooms, userConversations }) => {
		if (userConversations) {
			callback({ userConversations });
		}
		socket.join(rooms);
	});

	socket.on('find_recipient', ({ recipient, senderId }, callback) => {
		searchUsers({ recipient, senderId }, callback);
	});

	socket.on('fetch_populated_conversation', ({ convoId }, callback) => {
		fetchConversation({ convoId }, callback);
	});

	socket.on('new_message', ({ incomingMessage }, callback) => {
		// console.log(incomingMessage);
		const socketRoomId =
			incomingMessage.socketRoomId && incomingMessage.socketRoomId !== undefined
				? incomingMessage.socketRoomId
				: `${socket.id}_${incomingMessage.recipientIds[0]}_${incomingMessage.recipientIds[1]}`;

		let message = {
			...incomingMessage,
			socketRoomId,
		};

		sendNewMessage(
			{
				message,
				socketRoomId,
			},
			callback
		).then(({ updatedConversation, newConversation }) => {
			if (updatedConversation) {
				callback({ activeConversation: updatedConversation });

				console.log('Im in these rooms: ', socket.rooms);
				console.log('Should include: ', socketRoomId);
				io.to(socketRoomId).emit('updated_conversation', { updatedConversation });
			}
			if (newConversation) {
				socket.join(socketRoomId);
				console.log('Im in these rooms: ', socket.rooms);
				console.log('Should include: ', socketRoomId);
				callback({ activeConversation: newConversation });
				io.to(socketRoomId).emit('updated_conversation', { newConversation });
			}
		});
	});

	// User leaves messenger page
	return socket.on('close_messenger', ({ user }, callback) => {
		console.log('close messenger function');
		return socket.disconnect();
	});
};

module.exports = messageSocketEvents;
