const Users = require('../../models/users/userProfile');

const utilitySocketEvents = (socket, io, callback) => {
	socket.on('search_sounds_like', ({ artist }, callback) => {
		function makeReg(text) {
			return new RegExp(`${text}`, 'i');
		}

		Users.find({
			$or: [{ 'styleInfo.soundsLike': makeReg(artist) }],
		}).then((results) => {
			const matches = [];
			results.map((result) => {
				result.styleInfo.soundsLike.map(async (sl) => {
					console.log(sl);
					if (
						sl.toLowerCase().includes(artist.toLowerCase()) &&
						!matches.includes(sl.toLowerCase())
					) {
						await matches.push(sl.toLowerCase());
					}
					return null;
				});
				return null;
			});

			callback({ results: matches });
		});
	});
};

module.exports = { utilitySocketEvents };
