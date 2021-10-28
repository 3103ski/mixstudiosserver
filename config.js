// require('dotenv').config();

module.exports = {
	secretKey: '12345-67890-09876-54321',
	mongoUrl: 'mongodb://localhost:27017/mixstudios',
	avatarsURL: '/public/images/avatars',

	credentials: {
		AWS_SECRET: process.env.AWS_SECRET_KEY,
		AWS_KEY: process.env.AWS_KEY_ID,

		FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
		FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	},
};
