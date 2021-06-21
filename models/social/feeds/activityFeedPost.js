const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Populate = require('../../../util/autoPopulate');

const activityPost = new Schema(
	{
		activityType: { type: String, required: true },
		images: { type: Array },
		portfolioItem: { type: Schema.Types.ObjectId, ref: 'PortfolioEntryObject' },
		location: { type: String },
		pricingProfile: {},
		userId: { type: String },
		updateMessage: { type: String },
		isPosted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

activityPost.pre('findOne', Populate('portfolioItem')).pre('find', Populate('portfolioItem'));

const ActivityPost = mongoose.model('ActivityPost', activityPost, 'activityPosts');

module.exports = ActivityPost;
