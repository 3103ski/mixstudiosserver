const cors = require('cors');

const whitelist = [
	'http://localhost:3001',
	'http://localhost:3000',
	'http://localhost:3003',
	'https://localhost:3443',
	'http://localhost:3443',
	'http://13.58.190.176:3003/',
	'https://13.58.190.176:3443',
	'http://75.2.60.5',
	'https://75.2.60.5',
	'https://mixstudios.netlify.app',
	'http://mixstudios.netlify.app',
];
const corsOptionsDelegate = (req, callback) => {
	let corsOptions;

	console.log('CORS is still seeing it');
	// console.log('CORS is still seeing it: ', req.headers);

	// Standard requests have 'req.header', axios has 'res.headers'
	if (
		whitelist.indexOf(req.header('Origin')) !== -1 ||
		whitelist.indexOf(req.headers.origin) !== -1
	) {
		console.log('cors said yes');
		corsOptions = { origin: true };
	} else {
		console.log('cors said no');
		corsOptions = {
			origin: false,
		};
	}
	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
