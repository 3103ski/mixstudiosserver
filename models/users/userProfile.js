const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');

// FULL PROFILE SCHEMA ASSEMBELED AT BOTTOM

//*******************************/
//______________________________
//______________________________
// SCHEMA FOR USER INFO
//----------------------

// const userInfoSchema = new Schema(
// 	{
// 		email: {
// 			type: mongoose.SchemaTypes.Email,
// 			required: true,
// 			unique: true,
// 		},
// 		languages: {
// 			type: Array,
// 			required: true,
// 		},
// 		firstName: {
// 			type: String,
// 			required: true,
// 		},
// 		lastName: {
// 			type: String,
// 			required: true,
// 		},
// 		location: {
// 			type: String,
// 		},
// 	},
// 	{
// 		_id: false,
// 		timestamps: true,
// 	}
// );

//*******************************/
//______________________________
//______________________________
//  SCHEMA FOR STYLES INFO
//-------------------------

//************* */
// MUSIC
//------
// const musicSchema = new Schema(
// 	{
// 		confidentGenres: {
// 			type: Array,
// 			default: [],
// 		},
// 		lessExperiencedGenres: {
// 			type: Array,
// 			default: [],
// 		},
// 		unwillingGenres: {
// 			type: Array,
// 			default: [],
// 		},
// 	},
// 	{
// 		_id: false,
// 	}
// );

//************* */
// TV
//------

// const tvTypeSchema = new Schema(
// 	{
// 		tvAndFilm: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		commercials: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		theater: {
// 			type: Boolean,
// 			default: false,
// 		},
// 	},
// 	{
// 		_id: false,
// 	}
// );

// const tvGenresSchema = new Schema(
// 	{
// 		confidentGenres: {
// 			type: Array,
// 			default: [],
// 		},
// 		lessExperiencedGenres: {
// 			type: Array,
// 			default: [],
// 		},
// 	},
// 	{
// 		_id: false,
// 	}
// );

// const tvMusicSchema = new Schema(
// 	{
// doesOffer: {
// 	type: Boolean,
// 	default: false,
// },
// confidentGenres: {
// 	type: Array,
// 	default: [],
// },
// lessConfidentGenres: {
// 	type: Array,
// 	default: [],
// },
// unwillingGenres: {
// 	type: Array,
// 	default: [],
// },
// moods: {
// 	type: Array,
// 	default: [],
// },
// scenes: {
// 	type: Array,
// 	default: [],
// },
// 	},
// 	{
// 		_id: false,
// 	}
// );

// ASSEMBLED tv schema
// const tvSchema = new Schema(
// 	{
// 		doesOffer: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		tvType: {
// 			tvAndFilm: {
// 				type: Boolean,
// 				default: false,
// 			},
// 			commercials: {
// 				type: Boolean,
// 				default: false,
// 			},
// 			theater: {
// 				type: Boolean,
// 				default: false,
// 			},
// 		},
// 		tvGenres: {
// 			confidentGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			lessExperiencedGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 		},
// 		tvMusic: {
// 			doesOffer: {
// 				type: Boolean,
// 				default: false,
// 			},
// 			confidentGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			lessConfidentGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			unwillingGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			moods: {
// 				type: Array,
// 				default: [],
// 			},
// 			scenes: {
// 				type: Array,
// 				default: [],
// 			},
// 		},
// 	},
// 	{
// 		_id: false,
// 	}
// );

// ******  Assembled parts for userProfile.styleInfo
// const styleInfoSchema = new Schema(
// 	{
// 		music: {
// 			confidentGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			lessExperiencedGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 			unwillingGenres: {
// 				type: Array,
// 				default: [],
// 			},
// 		},
// 		tv: {
// 			doesOffer: {
// 				type: Boolean,
// 				default: false,
// 			},
// 			tvType: {
// 				tvAndFilm: {
// 					type: Boolean,
// 					default: false,
// 				},
// 				commercials: {
// 					type: Boolean,
// 					default: false,
// 				},
// 				theater: {
// 					type: Boolean,
// 					default: false,
// 				},
// 			},
// 			tvGenres: {
// 				confidentGenres: {
// 					type: Array,
// 					default: [],
// 				},
// 				lessExperiencedGenres: {
// 					type: Array,
// 					default: [],
// 				},
// 			},
// 			tvMusic: {
// 				doesOffer: {
// 					type: Boolean,
// 					default: false,
// 				},
// 				confidentGenres: {
// 					type: Array,
// 					default: [],
// 				},
// 				lessConfidentGenres: {
// 					type: Array,
// 					default: [],
// 				},
// 				unwillingGenres: {
// 					type: Array,
// 					default: [],
// 				},
// 				moods: {
// 					type: Array,
// 					default: [],
// 				},
// 				scenes: {
// 					type: Array,
// 					default: [],
// 				},
// 			},
// 		},
// 		soundsLike: {
// 			type: Array,
// 			default: [], // will hold ids referencing sounds like objects
// 		},
// 	},
// 	{
// 		_id: false,
// 		timestamps: true,
// 	}
// );

//************************* */
// ASSEMBLED Service Profile Schema
//----

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

// const serviceProfileSchema = new Schema(
// 	{
// 		offersServices: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		mixing: service,
// 		mastering: service,
// 		producer: service,
// 		singer: service,
// 		songwriter: service,
// 		studioMusician: service,
// 	},
// 	{
// 		_id: false,
// 	}
// );

//*****************************/
//*****************************/
//__________________________
//__________________________
//  Assembled User Profile
//     Schema for export
//--------------------------

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
				required: true,
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
