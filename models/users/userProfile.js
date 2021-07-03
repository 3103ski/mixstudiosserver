const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require('mongoose-type-email');

const falseDefaultBoolean = {
	type: Boolean,
	default: false,
};

const userProfileSchema = new Schema(
	{
		info: {
			languages: {
				type: Array,
				default: ['english'],
			},
			bio: {
				type: String,
			},
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
			displayName: { type: String, required: true },
			locations: {
				type: Array,
				default: [],
			},
			avatar: {
				type: String,
				default: '',
			},
		},
		styleInfo: {
			soundsLike: {
				type: Array,
				default: [],
			},
			gear: { type: Array, default: [] },
			instruments: { type: Array, default: [] },
			music: {
				confidentGenres: {
					type: Array,
					default: [],
				},
				lessExperiencedGenres: {
					type: Array,
					default: [],
				},
				unwillingGenres: {
					type: Array,
					default: [],
				},
			},
		},
		isOfferingServices: {
			type: Boolean,
			default: false,
		},
		artistServices: {
			mixing: falseDefaultBoolean,
			mastering: falseDefaultBoolean,
			producer: falseDefaultBoolean,
			singer: falseDefaultBoolean,
			songwriter: falseDefaultBoolean,
			studioMusician: falseDefaultBoolean,
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		googleId: String,
		facebookId: String,
		spotifyId: String,
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		reviews: {
			type: Array,
			default: [],
		},
		isLoggedIn: {
			type: Boolean,
			default: false,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

userProfileSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('UserProfile', userProfileSchema);
