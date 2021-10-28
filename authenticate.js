const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const FileType = require('file-type');
// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { AWS_KEY, AWS_SECRET } = require('./config.js');

const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-token-google2').Strategy;

// Amazon s3 for avatar bucket

AWS.config.update({
	accessKeyId: AWS_KEY,
	secretAccessKey: AWS_SECRET,
});

const s3 = new AWS.S3();

const uploadAvatar = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		ContentType: type.mime,
		Body: buffer,
		Bucket: 'ms-avatars',
		Key: `${name}`,
	};

	return s3.upload(params).promise();
};

// Local Strategies
const User = require('./models/users/userProfile');
const config = require('./config.js');

exports.local = passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
	return jwt.sign(user, config.secretKey, { expiresIn: 10800 });
};

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// STRATEGIES
exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('it happened here');
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			} else if (user) {
				let newLastLogin = Date.now();
				user.lastLogin = newLastLogin;
				user.save();
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

exports.googleStrategy = passport.use(
	new GoogleTokenStrategy(
		{
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
		},
		async function (accessToken, refreshToken, profile, done) {
			User.findOne({ googleId: profile.id }, async (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (!err && user) {
					return done(null, user);
				} else {
					user = new User({
						email: profile.emails[0].value,
						info: { displayName: profile.displayName },
					});

					user.googleId = profile.id;

					user.info.firstName = profile.name.givenName;
					user.info.lastName = profile.name.familyName;

					if (profile._json.picture) {
						const avatarUrl = profile._json.picture;
						const avatarResponse = await fetch(avatarUrl);
						const avatarBuffer = await avatarResponse.buffer();
						const type = await FileType.fromBuffer(avatarBuffer);

						uploadAvatar(avatarBuffer, user._id.toString(), type)
							.then((s3Res) => {
								user.info.avatar = s3Res.Location;

								user.save((err) => {
									if (err) {
										console.log(
											'We are getting an error on saving this user: ',
											err
										);
										return done(err, false);
									} else {
										return done(null, user);
									}
								});
							})
							.catch((err) => done(err, false));
					} else {
						user.save((err) => {
							if (err) {
								return done(err, false);
							} else {
								return done(null, user);
							}
						});
					}
				}
			});
		}
	)
);

exports.facebookPassport = passport.use(
	new FacebookTokenStrategy(
		{
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			fbGraphVersion: 'v3.0',
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne({ facebookId: profile.id }, async (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (!err && user) {
					return done(null, user);
				} else {
					user = new User({
						email: profile.emails[0].value,
						info: { displayName: profile.displayName },
					});

					user.facebookId = profile.id;
					// user.displayName = profile.displayName;

					user.info.firstName = profile.name.givenName;
					user.info.lastName = profile.name.familyName;
					// user.info.email = profile.emails[0].value;

					if (profile.photos[0] && profile.photos[0].value) {
						const avatarUrl = profile.photos[0].value;
						const avatarResponse = await fetch(avatarUrl);
						const avatarBuffer = await avatarResponse.buffer();
						const type = await FileType.fromBuffer(avatarBuffer);
						uploadAvatar(avatarBuffer, user._id.toString(), type)
							.then((s3Res) => {
								user.info.avatar = s3Res.Location;
								user.save((err) => {
									if (err) {
										return done(err, false);
									} else {
										return done(null, user);
									}
								});
							})
							.catch((err) => done(err, false));
					} else {
						user.save((err) => {
							if (err) {
								return done(err, false);
							} else {
								return done(null, user);
							}
						});
					}
				}
			});
		}
	)
);

// VARIFICATION
exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
	if (req.user.admin) {
		return next();
	} else {
		const err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		return next(err);
	}
};
