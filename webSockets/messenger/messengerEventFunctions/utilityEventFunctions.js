const UserProfile = require('../../../models/users/userProfile');

const searchUsers = ({ recipient }, callback) => {
	function makeReg(text) {
		return new RegExp(`${text}`, 'i');
	}

	if (recipient.length >= 3) {
		UserProfile.find({
			$or: [
				{ email: makeReg(recipient) },
				{ 'info.lastName': makeReg(recipient) },
				{ 'info.firstName': makeReg(recipient) },
				{ 'info.firstName': makeReg(recipient) },
				{ username: makeReg(recipient) },
			],
		}).then((results) => {
			if (results[0]) {
				const userInfos = results.map((result) => {
					return {
						firstName: result.info.firstName,
						lastName: result.info.lastName,
						email: result.info.email,
						avatar: result.info.avatar,
						languages: result.info.languages,
						displayName: result.info.displayName,
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
