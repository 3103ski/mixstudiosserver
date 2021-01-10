const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

// FULL PROFILE SCHEMA ASSEMBELED AT BOTTOM

//----------------------
//----------------------
// SCHEMA FOR USER INFO
//----------------------
const userInfoSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
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
			required: true,
		},
	},
	{
		_id: false,
	}
);

//-------------------------
//-------------------------
//  SCHEMA FOR STYLES INFO
//-------------------------

//___________
// MUSIC
//----------
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

//________________
// TV
//--------------

// TYPE
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

// TV MUSIC
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

// Assembled TV SCHEMA
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

// assembled parts for user profile
const styleInfoSchema = new Schema(
	{
		music: musicSchema,
		tv: tvSchema,
		tvMusic: tvMusicSchema,
		soundsLike: {
			type: Array,
			default: [], // will hold ids referencing sounds like objects
		},
	},
	{
		_id: false,
	}
);

//*******************************/
//______________________________
//______________________________
//      Assembled Schema
//------------------------------
const userProfileSchema = new Schema(
	{
		userInfo: userInfoSchema,
		styleInfo: styleInfoSchema,
	},
	{
		timestamps: true,
	}
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
