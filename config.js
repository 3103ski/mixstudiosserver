require('dotenv').config();

module.exports = {
	secretKey: '12345-67890-09876-54321',
	mongoUrl: 'mongodb://localhost:27017/mixstudios',
	avatarsURL: '/public/images/avatars',
	AWS_SECRET: process.env.AWS_SECRET_KEY,
	AWS_KEY: process.env.AWS_KEY_ID,
	facebook: {
		clientID: '1515252595349081',
		clientSecret: '7630033f01a7952554a10c98cb39697b',
	},
	google: {
		clientID: '555560470011-lm5fdsua6hfgtfl83vao6voj7sb9tg3b.apps.googleusercontent.com',
		clientSecret: '_iPw4JHC6oojm5PlZxBkhAKz',
	},
	spotify: {
		clientID: '58bff4c0f1a44c53a4a373652aa4d0be',
		clientSecret: '1624e159dc854fa88ad3357d5f6b9456',
	},
};
