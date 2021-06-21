const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const studioFeedPostSchema = new Schema(
	{
		postType: { type: String, required: true },
		threadId: { type: String },
		likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
		images: { type: Array },
		portfolioItem: { type: Schema.Types.ObjectId, ref: 'PortfolioEntryObject' },
		postText: { type: String },
		userId: { type: String },
		privacy: { type: String, default: 'public' },
		activityId: { type: String },
		updateMessage: { type: String },
	},
	{
		timestamps: true,
	}
);

studioFeedPostSchema
	.pre('findOne', Populate('likes'))
	.pre('find', Populate('likes'))
	.pre('findOne', Populate('portfolioItem'))
	.pre('find', Populate('portfolioItem'));

const StudioFeedPost = mongoose.model('StudioFeedPost', studioFeedPostSchema, 'studioFeedPosts');

module.exports = StudioFeedPost;
