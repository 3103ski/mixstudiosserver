const Notification = require('../../../models/notifications/messageNotification');

const fetchNewMessageCount = ({ userId }, callback) => {
	return Notification.find({ users: { $in: [userId] } })
		.then((notifications) => {
			let newMessageCount = 0;
			notifications.map((notification) => {
				notification.statusArray.map((status) => {
					if (status.userId === userId && status.seen === false) {
						newMessageCount++;
					}
				});
			});
			return newMessageCount;
		})
		.then((newMessageCount) => {
			callback({ newMessageCount });
		})
		.catch((error) => callback({ error }));
};

const dismissConversationNotifications = ({ conversationId, userId }, callback) => {
	Notification.find({ conversationId: conversationId }, function (error, notifications) {
		if (error) {
			callback({ error });
		}
		if (notifications) {
			notifications.forEach(function (notification) {
				let updatedStatusArray = notification.statusArray.map((status) => {
					if (status.userId === userId) {
						status.seen = true;
						return status;
					} else {
						return status;
					}
				});
				Notification.updateOne(
					{ _id: notification._id },
					{ $set: { statusArray: updatedStatusArray } }
				).then(() => {
					console.log('Update Successfull');
				});
			});
		}
	})
		.then(() => {
			callback({ success: true });
		})
		.catch((error) => callback({ error }));
};

module.exports = {
	dismissConversationNotifications,
	fetchNewMessageCount,
};
