const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateReportSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		isBug: {
			type: Boolean,
			default: false,
		},
		isNewFeature: {
			type: Boolean,
			default: false,
		},
		isUpdate: {
			type: Boolean,
			default: false,
		},
		relatedBugReport: {
			type: Object,
		},
		comments: {
			type: Array,
			default: [],
		},
		likes: {
			type: Array,
			default: [],
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
	},
	{
		timestamps: true,
	}
);

const UpdateReport = mongoose.model('UpdateReport', updateReportSchema);

module.exports = UpdateReport;
