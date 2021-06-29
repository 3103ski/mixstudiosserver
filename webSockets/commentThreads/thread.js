const {
	openThread,
	closeThread,
	postComment,
	likeComment,
	unlikeComment,
	replyToComment,
} = require('./eventFunctions');

const threadSocketEvents = (threadTitle, socket, io, callback) => {
	openThread({ threadTitle }, callback);

	// Join Soicket IO Room for comment thread
	socket.join(threadTitle);
	console.log(socket.rooms);

	// Handle new comments
	socket.on('post_comment', ({ threadTitle, commentPayload }, callback) => {
		postComment({ threadTitle, commentPayload }, callback)
			.then((newComment) => {
				callback({ newComment });
				io.to(threadTitle).emit('new_comment', { comment: newComment });
			})
			.catch((error) => {
				callback({ error });
			});
	});

	socket.on('reply_to_comment', ({ commentId, commentPayload }, callback) => {
		replyToComment({ commentId, commentPayload }, callback)
			.then((newComment) => {
				callback({ newComment });
				io.to(threadTitle).emit('comment_reply', { newComment, commentId });
			})
			.catch((error) => {
				callback({ error });
			});
	});

	// Handle Comment Likes
	socket.on('like_comment', ({ commentId, userId }, callback) => {
		likeComment({ commentId, userId }, callback)
			.then(({ comment }) => {
				if (comment) {
					callback({ comment });
					io.to(threadTitle).emit('likes_update', { comment });
				}
			})
			.catch((error) => {
				return callback({ error });
			});
	});

	socket.on('unlike_comment', ({ commentId, userId }, callback) => {
		unlikeComment({ commentId, userId }, callback)
			.then(({ comment }) => {
				callback({ comment });
				io.to(threadTitle).emit('likes_update', { comment });
			})
			.catch((error) => callback({ error }));
	});

	// Leave Thread
	return socket.on('close_comment_thread', ({ user, threadTitle }, callback) => {
		closeThread({ user, threadTitle }, callback);
		return socket.disconnect();
	});
};

module.exports = threadSocketEvents;
