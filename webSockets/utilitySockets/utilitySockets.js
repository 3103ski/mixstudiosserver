const Users = require('../../models/users/userProfile');

const utilitySocketEvents = (socket) => {
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

	socket.on('search_languages', ({ language }, callback) => {
		function makeReg(text) {
			return new RegExp(`${text}`, 'i');
		}

		Users.find({
			$or: [{ 'info.languages': makeReg(language) }],
		}).then((results) => {
			const matches = [];
			results.map((result) => {
				result.info.languages.map(async (langRes) => {
					console.log(langRes);
					if (
						langRes.toLowerCase().includes(language.toLowerCase()) &&
						!matches.includes(langRes.toLowerCase())
					) {
						await matches.push(langRes.toLowerCase());
					}
					return null;
				});
				return null;
			});

			callback({ results: matches });
		});
	});

	socket.on('search_genres', ({ genre }, callback) => {
		function makeReg(text) {
			return new RegExp(`${text}`, 'i');
		}

		Users.find({
			$or: [
				{ 'styleInfo.music.confidentGenres': makeReg(genre) },
				{ 'styleInfo.music.lessExperiencedGenres': makeReg(genre) },
			],
		}).then((results) => {
			const matches = [];

			results.map((result) => {
				result.styleInfo.music.confidentGenres.map(async (genreRes) => {
					console.log(genreRes);
					if (
						genreRes.toLowerCase().includes(genre.toLowerCase()) &&
						!matches.includes(genreRes.toLowerCase())
					) {
						await matches.push(genreRes.toLowerCase());
					}
					return null;
				});

				result.styleInfo.music.lessExperiencedGenres.map(async (genreRes) => {
					console.log(genreRes);
					if (
						genreRes.toLowerCase().includes(genre.toLowerCase()) &&
						!matches.includes(genreRes.toLowerCase())
					) {
						console.log('pushing: ', genreRes.toLowerCase());
						console.log('to: ', matches);

						await matches.push(genreRes.toLowerCase());
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
