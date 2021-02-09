const fs = require('fs');

exports.publicAccessDelete = async (path, fileName) => {
	console.log('_)!(@#%_*(!#&@%(!*)$@_%(!@');
	if (path && fileName) {
		try {
			fs.unlinkSync('./public' + path + fileName);
			return true;
		} catch (err) {
			console.log('DIDNOTWORK!!', err);
			return false;
		}
	}
};
