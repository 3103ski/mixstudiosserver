const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../util/autoPopulate');

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Like',
			},
		],
		tags: {
			type: Array,
			default: [],
		},
		subscribers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'UserProfile',
			},
		],
		comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	},
	{
		timestamps: true,
	}
);

commentSchema
	.pre('findOne', Populate('comments'))
	.pre('find', Populate('comments'))
	.pre('findOne', Populate('likes'))
	.pre('find', Populate('likes'));

const Comment = mongoose.model('Comment', commentSchema, 'comments');

module.exports = Comment;
