const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const pinCollectionSchema = new Schema(
	{
		userId: {},
		subscribers: {
			type: Array,
			default: [],
		},
		recipientIds: {
			type: Array,
			default: [],
		},
		pins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
	},
	{
		timestamps: true,
	}
);

pinCollectionSchema.pre('findOne', Populate('pins')).pre('find', Populate('pins'));

const PinCollection = mongoose.model('PinCollection', pinCollectionSchema, 'pinCollections');

module.exports = PinCollection;
