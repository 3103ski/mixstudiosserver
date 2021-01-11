// const singerGenreRate = new Schema({
// 	isFlateRate: {
// 		type: Boolean,
// 		default: false,
// 	},
// 	flatRate: {
// 		type: Currency,
// 		default: 0,
// 		min: 0,
// 	},
// 	leadVocalRate: {
// 		type: Currency,
// 		default: 0,
// 		min: 0,
// 	},
// 	perPartRate: {
// 		type: Currency,
// 		default: 0,
// 		min: 0,
// 	},
// 	backgroundVocalRate: {
// 		type: Currency,
// 		default: 0,
// 		min: 0,
// 	},
// 	genreRates: {
// 		type: Array,
// 		default: [],
// 	},
// });

// const singerPricing = new Schema(
// 	{
// 		isFlatRate: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		isLessForBackgroundVocals: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		isStructuredByPart: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		hasGenreFlatRate: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		hasConfidentFlatRate: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		flatRate: {
// 			type: Currency,
// 			default: null,
// 			min: 0,
// 		},
// 		leadVocalRate: {
// 			type: Currency,
// 			default: null,
// 			min: 0,
// 		},
// 		backgroundVocalRate: {
// 			type: Currency,
// 			default: null,
// 			min: 0,
// 		},
// 		perPartRate: {
// 			type: Currency,
// 			default: null,
// 			min: 0,
// 		},
// 		confidentGenreRates: {
// 			type: singerGenreRate,
// 			default: () => ({}),
// 		},
// 		lessExperiencedGenreRates: {
// 			type: singerGenreRate,
// 			default: () => ({}),
// 		},
// 	},
// 	{
// 		_id: false,
// 	}
// );
