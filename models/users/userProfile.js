const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');

const service = {
	doesOffer: {
		type: Boolean,
		default: false,
	},
	profileId: {
		type: String,
		default: null,
	},
};

const userProfileSchema = new Schema(
	{
		userInfo: {
			email: {
				type: mongoose.SchemaTypes.Email,
				required: true,
				unique: true,
			},
			languages: {
				type: Array,
				default: ['English'],
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
			location: {
				type: String,
			},
			avatar: {
				type: String,
			},
		},
		styleInfo: {
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
			tv: {
				doesOffer: {
					type: Boolean,
					default: false,
				},
				tvType: {
					tvAndFilm: {
						type: Boolean,
						default: false,
					},
					commercials: {
						type: Boolean,
						default: false,
					},
					theater: {
						type: Boolean,
						default: false,
					},
				},
				tvGenres: {
					confidentGenres: {
						type: Array,
						default: [],
					},
					lessExperiencedGenres: {
						type: Array,
						default: [],
					},
				},
				tvMusic: {
					doesOffer: {
						type: Boolean,
						default: false,
					},
					confidentGenres: {
						type: Array,
						default: [],
					},
					lessConfidentGenres: {
						type: Array,
						default: [],
					},
					unwillingGenres: {
						type: Array,
						default: [],
					},
					moods: {
						type: Array,
						default: [],
					},
					scenes: {
						type: Array,
						default: [],
					},
				},
			},
			soundsLike: {
				type: Array,
				default: [], // will hold ids referencing sounds like objects
			},
		},
		serviceProfiles: {
			offersServices: {
				type: Boolean,
				default: false,
			},
			mixing: service,
			mastering: service,
			producer: service,
			singer: service,
			songwriter: service,
			studioMusician: service,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

userProfileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserProfile', userProfileSchema);
