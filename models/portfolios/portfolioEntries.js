const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioEntry = new Schema(
	{
		likes: {
			type: Array,
			default: [],
		},
		comments: {
			type: Array,
			default: [],
		},
		ratings: {
			type: Array,
			default: [],
		},
		userId: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		category: {
			type: String,
			default: 'default',
		},
		image: {
			type: String,
			default: '',
		},
		isBeforeAfter: {
			type: Boolean,
			default: false,
		},
		audioOne: {
			type: String,
			default: null,
		},
		audioTwo: {
			type: String,
			default: null,
		},
		audioOneOriginalName: {
			type: String,
			default: null,
		},
		audioTwoOriginalName: {
			type: String,
			default: null,
		},
		genreOne: {
			type: String,
			default: null,
		},
		genreTwo: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const PortfolioEntryObject = mongoose.model('PortfolioEntryObject', portfolioEntry);

module.exports = PortfolioEntryObject;
