const Thread = require('../../models/social/threads/thread');
const Comment = require('../../models/social/threads/comment');
const Like = require('../../models/social/like');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const openThread = ({ threadTitle }, callback) => {
	Thread.findOne({ threadTitle: threadTitle })
		.then((thread) => {
			if (thread) {
				callback({ thread });
			} else {
				callback({
					error: 'You just searched for a comment thread that does not exist in the DB.',
				});
			}
		})
		.catch((err) => {
			console.log('This is the area with the like populate on: ', err);
			callback({ error: err });
		});
};

const closeThread = ({ user, threadTitle }, callback) => {
	callback(`Socket.Io sees ${user} Leaving ${threadTitle}`);
};

const userIsSubscribed = (thread, userId) => {
	return thread.subscribers.filter((id) => id === userId).length === 1;
};

const postComment = (
	{ threadTitle, commentPayload: { comment, userId, avatar, author } },
	callback
) => {
	return Thread.findOne({ threadTitle: threadTitle })
		.then((thread) => {
			if (thread) {
				if (!userIsSubscribed(thread, userId)) {
					thread.subscribers.push(ObjectId(userId));
				}

				return Comment.create({
					comment,
					userId,
					avatar,
					author,
				})
					.then((comment) => {
						thread.comments.push(comment._id);
						thread.save();

						return comment;
					})
					.catch((error) => callback({ error }));
			} else {
				return Thread.create({
					threadTitle: threadTitle,
				})
					.then((thread) => {
						if (!userIsSubscribed(thread, userId)) {
							thread.subscribers.push(ObjectId(userId));
						}

						return Comment.create({
							comment,
							userId,
							avatar,
							author,
						})
							.then((comment) => {
								thread.comments.push(comment._id);
								thread.save();

								return comment;
							})
							.catch((error) => callback({ error }));
					})
					.catch((error) => callback({ error }));
			}
		})
		.catch((error) => callback({ error }));
};

const replyToComment = (
	{ commentId, commentPayload: { comment, userId, avatar, author } },
	callback
) => {
	return Comment.findOne({ _id: commentId }).then((rootComment) => {
		if (rootComment) {
			if (!userIsSubscribed(rootComment, userId)) {
				rootComment.subscribers.push(ObjectId(userId));
			}

			return Comment.create({
				comment,
				userId,
				avatar,
				author,
			})
				.then((comment) => {
					rootComment.comments.push(comment._id);
					rootComment.save();

					return comment;
				})
				.catch((error) => callback({ error }));
		}
	});
};

const likeComment = ({ commentId, userId }, callback) => {
	return Comment.findOne({ _id: commentId }).then((comment) => {
		if (comment) {
			if (comment.likes.filter((like) => `${like.userId}` === `${userId}`)[0]) {
				callback({ error: 'You already like this comment' });
			} else {
				return Like.create({ userId })
					.then((newLike) => {
						comment.likes.push(newLike._id);
						comment.save();
						return { comment };
					})
					.catch((error) => callback({ error }));
			}
		} else {
			callback({
				error: 'The ID submitted does not match the comment you are trying to like',
			});
		}
	});
};

const unlikeComment = ({ commentId, userId }, callback) => {
	return Comment.findOne({ _id: commentId })
		.then((comment) => {
			const userLike = comment.likes.filter((like) => `${like.userId}` === `${userId}`)[0];
			const updatedLikes = comment.likes.filter((like) => `${like.userId}` !== `${userId}`);

			comment.likes = updatedLikes;
			comment.save();
			return Like.findOneAndDelete({ _id: userLike._id }).then((removedLike) => {
				return { comment };
			});
		})
		.catch((error) => callback({ error }));
};

module.exports = {
	openThread,
	closeThread,
	postComment,
	likeComment,
	unlikeComment,
	replyToComment,
};
