const jwt = require('jsonwebtoken');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-token-google2').Strategy;
const SpotifyTokenStrategy = require('passport-spotify').Strategy;

// Local
const User = require('./models/users/userProfile');
const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, cb) {
	cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

exports.getToken = (user) => {
	// return jwt.sign(user, config.secretKey, { expiresIn: 10 });
	return jwt.sign(user, config.secretKey, { expiresIn: 10800 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// STRATEGIES
exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('JWT payload:', jwt_payload);
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

// exports.spotifyStrategy = passport.use(
// 	new GoogleTokenStrategy(
// 		{
// 			clientID: config.spotify.clientID,
// 			clientSecret: config.spotify.clientSecret,
// 		},
// 		function (accessToken, refreshToken, profile, done) {
// 			console.log('And we did it with spotify too!', profile);
// 			return done(null, profile);
// 			User.findOne({ spotifyId: profile.id }, (err, user) => {
// 				if (err) {
// 					console.log(`Didn't go far`, err);
// 					return done(err, false);
// 				}
// 				if (!err && user) {
// 					console.log(`We already found it: `, user);
// 					return done(null, user);
// 				} else {
// 					console.log(`We're gonna try and make it`);
// 					user = new User({ username: profile.displayName });
// 					user.googleId = profile.id;
// 					user.userInfo.firstName = profile.name.givenName;
// 					user.userInfo.lastName = profile.name.familyName;
// 					user.userInfo.email = profile.emails[0].value;
// 					console.log('We were almost there');
// 					user.save((err) => {
// 						if (err) {
// 							console.log('We were RIGHT there', err);
// 							return done(err, false);
// 						} else {
// 							return done(null, user);
// 						}
// 					});
// 				}
// 			});
// 		}
// 	)
// );
exports.googleStrategy = passport.use(
	new GoogleTokenStrategy(
		{
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
		},
		function (accessToken, refreshToken, profile, done) {
			console.log('And we did it with google too!', profile);
			User.findOne({ googleId: profile.id }, (err, user) => {
				if (err) {
					console.log(`Didn't go far`, err);
					return done(err, false);
				}
				if (!err && user) {
					console.log(`We already found it: `, user);
					return done(null, user);
				} else {
					console.log(`We're gonna try and make it`);
					user = new User({ username: profile.displayName });
					user.googleId = profile.id;
					user.userInfo.firstName = profile.name.givenName;
					user.userInfo.lastName = profile.name.familyName;
					user.userInfo.email = profile.emails[0].value;
					console.log('We were almost there');
					user.save((err) => {
						if (err) {
							return done(err, false);
						} else {
							return done(null, user);
						}
					});
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
			User.findOne({ facebookId: profile.id }, (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (!err && user) {
					return done(null, user);
				} else {
					user = new User({ username: profile.displayName });

					user.facebookId = profile.id;
					user.userInfo.firstName = profile.name.givenName;
					user.userInfo.lastName = profile.name.familyName;
					user.userInfo.email = profile.emails[0].value;

					user.save((err) => {
						if (err) {
							return done(err, false);
						} else {
							return done(null, user);
						}
					});
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
