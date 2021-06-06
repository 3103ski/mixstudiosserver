const PinCollection = require('../../../models/social/messenger/pinCollection');
const Pin = require('../../../models/social/messenger/pin');

const pinMessage = ({ payload }, callback) => {
	const { pin, message } = payload;

	return PinCollection.find({ recipientIds: { $all: message.recipientIds }, userId: pin.userId })
		.then((collection) => {
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
					.catch((error) => callback({ error }));
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
					.catch((error) => callback({ error }));
			}
		})
		.catch((error) => callback({ error }));
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
							if (updatedPins.length === 0) {
								PinCollection.deleteOne({ _id: collectionResults[0]._id })
									.then(() => {
										Pin.deleteOne({ _id: pinToRemove._id })
											.then(() => {
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
									.then(() => {
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

const fetchPinCollections = ({ userId }, callback) => {
	return PinCollection.find({ userId: userId })
		.then((collections) => {
			return callback({ pinCollections: collections });
		})
		.catch((err) => callback({ error: err }));
};

module.exports = {
	pinMessage,
	fetchPinCollections,
	unpinMessage,
};
