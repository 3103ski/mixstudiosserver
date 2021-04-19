const jwt = require('jsonwebtoken');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
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

exports.facebookPassport = passport.use(
	new FacebookTokenStrategy(
		{
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: '/facebook/callback',
			profileFields: [
				'id',
				'displayName',
				'email',
				'name',
				'photos',
				'givenName',
				'familyName',
			],
			passReqToCallback: true,
		},
		(accessToken, refreshToken, profile, done) => {
			console.log('IN THE STRATEGY');
			User.findOne({ facebookId: profile.id }, (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (!err && user) {
					return done(null, user);
				} else {
					user = new User({ username: profile.displayName });
					user.facebookId = profile.id;
					user.firstName = profile.name.givenName;
					user.lastName = profile.name.familyName;
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
