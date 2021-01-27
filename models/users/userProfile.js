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

const userInfoSchema = new Schema(
	{
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
	{
		_id: false,
		timestamps: true,
	}
);

//*******************************/
//______________________________
//______________________________
//  SCHEMA FOR STYLES INFO
//-------------------------

//************* */
// MUSIC
//------
const musicSchema = new Schema(
	{
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
	{
		_id: false,
	}
);

//************* */
// TV
//------

const tvTypeSchema = new Schema(
	{
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
	{
		_id: false,
	}
);

const tvGenresSchema = new Schema(
	{
		confidentGenres: {
			type: Array,
			default: [],
		},
		lessExperiencedGenres: {
			type: Array,
			default: [],
		},
	},
	{
		_id: false,
	}
);

const tvMusicSchema = new Schema(
	{
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
	{
		_id: false,
	}
);

// ASSEMBLED tv schema
const tvSchema = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		tvType: tvTypeSchema,
		tvGenres: tvGenresSchema,
		tvMusic: tvMusicSchema,
	},
	{
		_id: false,
	}
);

// ******  Assembled parts for userProfile.styleInfo
const styleInfoSchema = new Schema(
	{
		music: { type: musicSchema, default: () => ({}) },
		tv: { type: tvSchema, default: () => ({}) },
		tvMusic: { type: tvMusicSchema, default: () => ({}) },
		soundsLike: {
			type: Array,
			default: [], // will hold ids referencing sounds like objects
		},
	},
	{
		_id: false,
		timestamps: true,
	}
);

//************************* */
// ASSEMBLED Service Profile Schema
//----

const service = new Schema(
	{
		doesOffer: {
			type: Boolean,
			default: false,
		},
		profileId: {
			type: String,
			default: null,
		},
	},
	{
		_id: false,
	}
);

const serviceProfileSchema = new Schema(
	{
		offersServices: {
			type: Boolean,
			default: false,
		},
		mixing: {
			type: service,
			default: () => ({}),
		},
		mastering: {
			type: service,
			default: () => ({}),
		},
		producer: {
			type: service,
			default: () => ({}),
		},
		singer: {
			type: service,
			default: () => ({}),
		},
		songwriter: {
			type: service,
			default: () => ({}),
		},
		studioMusician: {
			type: service,
			default: () => ({}),
		},
	},
	{
		_id: false,
	}
);

//*****************************/
//*****************************/
//__________________________
//__________________________
//  Assembled User Profile
//     Schema for export
//--------------------------

const userProfileSchema = new Schema(
	{
		userInfo: userInfoSchema,
		styleInfo: { type: styleInfoSchema, default: () => ({}) },
		serviceProfiles: { type: serviceProfileSchema, default: () => ({}) },
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
