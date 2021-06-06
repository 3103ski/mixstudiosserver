const UserProfile = require('../../../models/users/userProfile');

const searchUsers = ({ recipient }, callback) => {
	function makeReg(text) {
		return new RegExp(`${text}`, 'i');
	}

	if (recipient.length >= 3) {
		UserProfile.find({
			$or: [
				{ 'userInfo.email': makeReg(recipient) },
				{ 'userInfo.lastName': makeReg(recipient) },
				{ 'userInfo.firstName': makeReg(recipient) },
				{ 'userInfo.firstName': makeReg(recipient) },
				{ username: makeReg(recipient) },
			],
		}).then((results) => {
			if (results[0]) {
				const userInfos = results.map((result) => {
					return {
						firstName: result.userInfo.firstName,
						lastName: result.userInfo.lastName,
						email: result.userInfo.email,
						googleAvatar: result.userInfo.googleAvatar,
						facebookAvatar: result.userInfo.facebookAvatar,
						avatar: result.userInfo.avatar,
						spotifyAvatar: result.userInfo.spotifyAvatar,
						languages: result.userInfo.languages,
						username: result.username,
						userId: result._id,
					};
				});
				callback({ results: userInfos });
			} else {
				callback({ results: [] });
			}
		});
	} else {
		return callback({ results: [] });
	}
};

module.exports = {
	searchUsers,
};
