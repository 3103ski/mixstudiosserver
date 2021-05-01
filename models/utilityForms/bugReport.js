const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugReportSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		locationOfIssue: {
			type: String,
			required: true,
		},
		featureWithIssue: {
			type: String,
		},
		issueDescription: {
			type: String,
			required: true,
		},
		isOpen: {
			type: Boolean,
			default: true,
		},
		fixDisputedByUser: {
			type: Boolean,
			default: false,
		},
		notesOnFix: {
			type: String,
			default: '',
		},
		comments: {
			type: Array,
			default: [],
		},
		relatedIssues: {
			type: Array,
			default: [],
		},
		priority: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
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

const BugReport = mongoose.model('BugReport', bugReportSchema);

module.exports = BugReport;
