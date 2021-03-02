const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const rateStructure = new Schema(
	{
		upToFiveTracks: {
			type: Currency,
			min: 0,
		},
		upToTenTracks: {
			type: Currency,
			min: 0,
		},
		upToTwentyTracks: {
			type: Currency,
			min: 0,
		},
		upToThirtyTracks: {
			type: Currency,
			min: 0,
		},
		upToFortyFiveTracks: {
			type: Currency,
			min: 0,
		},
		upToSixtyTracks: {
			type: Currency,
			min: 0,
		},
		upToSeventyTracks: {
			type: Currency,
			min: 0,
		},
		upToNinetyTracks: {
			type: Currency,
			min: 0,
		},
		globalRate: {
			type: Currency,
			min: 0,
		},
		lowAvg: {
			type: Currency,
			min: 0,
		},
		avgRate: {
			type: Currency,
			min: 0,
		},
		avgHigh: {
			type: Currency,
			min: 0,
		},
	},
	{
		_id: false,
	}
);

const mixingPricingProfile = new Schema(
	{
		userId: {
			type: String,
		},
		title: {
			type: String,
			required: true,
		},
		mixingServiceProfileId: {
			type: String,
			required: true,
		},
		ratesAreBySize: {
			type: Boolean,
			default: null,
		},
		ratesAreByGenre: {
			type: Boolean,
			default: null,
		},
		ratesAreByConfidence: {
			type: Boolean,
			default: null,
		},
		confidenceRates: {
			lessExperiencedRates: {
				type: rateStructure,
				default: {},
			},
			condfidentRates: {
				type: rateStructure,
				default: {},
			},
		},
		ratesBySize: {
			type: rateStructure,
			default: {},
		},
		genreRates: {
			type: Array,
			default: [],
		},
		globaleFlatRate: {
			type: Number,
			default: null,
		},
		genreAverages: {
			type: Array,
			default: null,
		},
		extraServiceRates: {
			type: Object,
			default: {},
		},
		//••••••••••••••••••••••••••••••••••••••
		// isFlatRate: {
		// 	type: Boolean,
		// 	default: false,
		// },
		// hasGenreFlateRate: {
		// 	type: Boolean,
		// 	default: false,
		// },
		// confidenceLevelsAreSameRate: {
		// 	type: Boolean,
		// 	default: false,
		// },
		// genreRates: {
		// 	type: Array,
		// 	default: [], // populate at endpoint before serving to client
		// },
		// flatRate: {
		// 	upToFiveTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToTenTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToTwentyTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToThirtyTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToFortyFiveTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToSixtyTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToSeventyTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	upToNinetyTracks: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// },
		// equalConfidenceRates: {
		// 	genresAreFlatRate: {
		// 		type: Boolean,
		// 		default: false,
		// 	},
		// 	flatRate: {
		// 		upToFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTenTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTwentyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToThirtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToFortyFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSixtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSeventyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToNinetyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 	},
		// 	genreRates: {
		// 		type: Array,
		// 		default: [], // populate on client side from seperate endpoint
		// 	},
		// },
		// confidentGenres: {
		// 	isFlatRate: {
		// 		type: Boolean,
		// 		default: false,
		// 	},
		// 	flatRate: {
		// 		upToFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTenTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTwentyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToThirtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToFortyFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSixtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSeventyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToNinetyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 	},
		// 	genreRates: {
		// 		type: Array,
		// 		default: [], // populate on client side from seperate endpoint
		// 	},
		// },
		// lessExperiencedGenres: {
		// 	isFlatRate: {
		// 		type: Boolean,
		// 		default: false,
		// 	},
		// 	flatRate: {
		// 		upToFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTenTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToTwentyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToThirtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToFortyFiveTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSixtyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToSeventyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 		upToNinetyTracks: {
		// 			type: Currency,
		// 			min: 0,
		// 		},
		// 	},
		// 	genreRates: {
		// 		type: Array,
		// 		default: [], // populate on client side from seperate endpoint
		// 	},
		// },
		// addMasteringRate: {
		// 	type: Currency,
		// 	min: 0,
		// },
		// extraServiceRates: {
		// 	drumReplacement: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	manualPitchCorrection: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	autoPitchCorrection: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	replay: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// 	mixingAcousticDrums: {
		// 		type: Currency,
		// 		min: 0,
		// 	},
		// },
	},
	{
		timestamps: true,
	}
);

const MixingPricingProfile = mongoose.model('MixingPricingProfile', mixingPricingProfile);
module.exports = MixingPricingProfile;
