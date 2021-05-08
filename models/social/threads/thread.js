const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const thread = new Schema(
	{
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
		threadTitle: {
			type: String,
			required: true,
		},
		subscribers: {
			type: Array,
			default: [
				{
					type: Schema.Types.ObjectId,
					ref: 'UserProfile',
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

thread.pre('findOne', Populate('comments')).pre('find', Populate('comments'));

const Thread = mongoose.model('Thread', thread, 'threads');

module.exports = Thread;
