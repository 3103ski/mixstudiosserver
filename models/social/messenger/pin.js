const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../../../util/autoPopulate');

const pinSchema = new Schema(
	{
		title: { type: String, required: true },
		notes: { type: String },
		message: { type: Schema.Types.ObjectId, ref: 'Message' },
		userId: { type: String },
	},
	{
		timestamps: true,
	}
);

pinSchema.pre('findOne', Populate('message')).pre('find', Populate('message'));

const Pin = mongoose.model('Pin', pinSchema, 'pins');

module.exports = Pin;
