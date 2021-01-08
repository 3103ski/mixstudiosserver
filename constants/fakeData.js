//_______________________________
//      FAKE DATA FOR MODELING
//-------------------------------
//-------------------------------
//-------------------------------

// ************ USERS
exports.userProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		createdOn: new Date(),
		lastModified: new Date(),
		userInfo: {
			username: 'Tommy P',
			email: 'tommypeluso@me.com',
			languages: ['english'],
			firstName: 'Tommy',
			lastName: 'Peluso',
			location: 'Miami, Fl',
		},
		styleInfo: {
			music: {
				confidentGenres: ['rock', 'hip-hop', 'acoutic', 'pop', 'country'],
				lessExperiencedGenres: ['edm', 'reggae', 'latin'],
				unwillingGenres: ['death metal', 'heavy metal'],
			},
			tv: {
				doesOffer: true,
				types: {
					tvAndFilm: true,
					commercials: false,
					theater: false,
				},
				tvGenres: {
					confidentGenres: ['thriller', 'action'],
					lessExperiencedGenres: ['romance'],
					unwillingGenres: [],
				},
				tvMusic: {
					offersService: false,
					confidentGenres: [],
					lessExperiencedGenres: [],
					unwillingGenres: [],
					moodes: [],
					scenes: [],
				},
			},
			soundsLike: [], // fetch from db
		},
		serviceProfile: {
			offersServices: true,
			lastUpdated: new Date(),
			vocals: {
				offersService: false,
				profile: null,
			},
			songwriter: {
				offersService: false,
				profile: null,
			},
			producer: {
				offersService: true,
				profile: null,
			},
			musician: {
				offersService: false,
				profile: null,
			},
			mixing: {
				offersService: true,
				profile: null,
			},
			mastering: {
				offersService: true,
				profile: null,
			},
		},
	},
	{
		userId: '80167tg803vct965cn8vberyibufwejryv83',
		createdOn: new Date(),
		lastModified: new Date(),
		userInfo: {
			username: 'Bjastski',
			email: 'bjastski@gmail.com',
			languages: ['english', 'spanish'],
			firstName: 'Bryan',
			lastName: 'Jastrzembski',
			location: 'Seattle, Wa',
		},
		styleInfo: {
			music: {
				confidentGenres: ['rock', 'acoustic', 'country', 'folk'],
				lessExperiencedGenres: ['edm', 'reggae', 'latin'],
				unwillingGenres: [],
			},
			tv: {
				doesOffer: false,
				types: {
					tvAndFilm: false,
					commercials: false,
					theater: false,
				},
				tvGenres: {
					confidentGenres: [],
					lessExperiencedGenres: [],
					unwillingGenres: [],
				},
				tvMusic: {
					offersService: false,
					confidentGenres: [],
					lessExperiencedGenres: [],
					unwillingGenres: [],
					moodes: [],
					scenes: [],
				},
			},
			soundsLike: [], // fetch from db
		},
		serviceProfile: {
			offersServices: true,
			lastUpdated: new Date(),
			vocals: {
				offersService: false,
				profile: null,
			},
			songwriter: {
				offersService: false,
				profile: null,
			},
			producer: {
				offersService: true,
				profile: null,
			},
			musician: {
				offersService: false,
				profile: null,
			},
			mixing: {
				offersService: true,
				profile: null,
			},
			mastering: {
				offersService: true,
				profile: null,
			},
		},
	},
];
exports.artistSoundsLikeCollection = [
	{
		soundsLike: 'drake',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'bear hands',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'young the giant',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'coldplay',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'kanye west',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'jay-z',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
	},
	{
		soundsLike: 'conor oberst',
		userId: '80167tg803vct965cn8vberyibufwejryv83',
	},
	{
		soundsLike: 'lambchop',
		userId: '80167tg803vct965cn8vberyibufwejryv83',
	},
	{
		soundsLike: 'bill evans',
		userId: '80167tg803vct965cn8vberyibufwejryv83',
	},
	{
		soundsLike: 'ratatat',
		userId: '80167tg803vct965cn8vberyibufwejryv83',
	},
	{
		soundsLike: 'the swell season',
		userId: '892d3658927tbcr82o36gf93g623456f2gb', // user that created the 'sounds like' object
	},
];
exports.userInstrumentProfiles = [
	{
		name: 'guitar',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '12b1d8r4t1n9365rt13nrt67134',
		createdOn: new Date(),
		lastModified: new Date(),
		skillLevel: 3,
		yearsPlaying: 10,
	},
];

// ************ MIXING SERVICE
exports.mixingServiceGenreRates = [
	{
		pricingProfileId: '2c4h7025n1gnm9gtn812nuc451486gt5678cn',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '8927c6t89671y9r81c349gr61i87',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'rock',
		isConfidentRate: true,
		flatRate: {
			upToFiveTracks: 0,
			upToTenTracks: 0,
			upToTwentyTracks: 0,
			upToThirtyTracks: 0,
			upToFortyFiveTracks: 0,
			upToSixtyTracks: 0,
			upToSeventyTracks: 0,
			upToNinetyTracks: 0,
		},
	},
	{
		pricingProfileId: '2c4h7025n1gnm9gtn812nuc451486gt5678cn',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'v7903g64t03784m0h8cm0542',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'salsa',
		isConfidentRate: false,
		flatRate: {
			upToFiveTracks: 0,
			upToTenTracks: 0,
			upToTwentyTracks: 0,
			upToThirtyTracks: 0,
			upToFortyFiveTracks: 0,
			upToSixtyTracks: 0,
			upToSeventyTracks: 0,
			upToNinetyTracks: 0,
		},
	},
];
exports.mixingServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '902vnty907ntv804gtb280tn0524tv645t',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'mixing',
			alsoDoesMastering: false,
			extraServices: {
				drumReplacement: false,
				manualPitchCorrection: false,
				autoPitchCorrection: false,
				replay: false,
				mixingActousticDrums: false,
			},
		},
		pricing: {
			manualQuotingIsActive: true,
			pricingProfiles: [],
		},
	},
];
exports.mixingPricingProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2c4h7025n1gnm9gtn812nuc451486gt5678cn',
		details: {
			name: 'default pricing',
			createdOn: new Date(),
			lastModified: new Date(),
		},
		pricing: {
			isFlatRate: false,
			flatRate: {
				upToFiveTracks: 0,
				upToTenTracks: 0,
				upToTwentyTracks: 0,
				upToThirtyTracks: 0,
				upToFortyFiveTracks: 0,
				upToSixtyTracks: 0,
				upToSeventyTracks: 0,
				upToNinetyTracks: 0,
			},
			hasConfidentFlatRate: false,
			hasGenreFlateRate: false,
			addMasteringRate: 0,
			extraServiceRates: {
				drumReplacement: 0,
				manualPitchCorrection: 0,
				autoPitchCorrection: 0,
				replay: 0,
				mixingActousticDrums: 0,
			},
			confidentGenres: {
				hasConfidentFlatRate: false,
				confidentFlatRate: {
					upToFiveTracks: 0,
					upToTenTracks: 0,
					upToTwentyTracks: 0,
					upToThirtyTracks: 0,
					upToFortyFiveTracks: 0,
					upToSixtyTracks: 0,
					upToSeventyTracks: 0,
					upToNinetyTracks: 0,
				},
				genreRates: [], // fetch from api
			},
			lessExperiencedGenres: {
				hasConfidentFlatRate: false,
				confidentFlatRate: {
					upToFiveTracks: 0,
					upToTenTracks: 0,
					upToTwentyTracks: 0,
					upToThirtyTracks: 0,
					upToFortyFiveTracks: 0,
					upToSixtyTracks: 0,
					upToSeventyTracks: 0,
					upToNinetyTracks: 0,
				},
				genreRates: [], // fetch from api
			},
		},
	},
];

// ************ MASTERING SERVICE
exports.masteringServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'v2790yt0263gtbn986bnt25gt67v',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'mastering',
		},
		pricing: {},
	},
];
exports.masteringServiceGenreRates = [];
exports.masteringPricingProfiles = [];

// ************ SINGER SERVICE
exports.singerServiceGenreRates = [
	{
		genre: 'rock',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2v90h69723810736783cb51246nv45',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: true,
		rate: 0,
		perPartRate: null,
	},
	{
		genre: 'rap',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '258906ty548tvg4892t459t9469',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: true,
		rate: 0,
		perPartRate: null,
	},
	{
		genre: 'salsa',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '902587578926vn20v56nv20324085',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: true,
		rate: 0,
		perPartRate: null,
	},
	{
		genre: 'alternative',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '02v5ng0867gtn085vbt08bg2v0ntv',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: false,
		rate: 0,
		perPartRate: null,
	},
	{
		genre: 'tango',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '3r0v7yt2867tv2568vbg5ncuygbvnudys',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: false,
		rate: 0,
		perPartRate: null,
	},
	{
		genre: 'classical',
		pricingProfileId: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'n90vwyrtb86745682b345967rtnc5',
		createdOn: new Date(),
		lastModified: new Date(),
		isConfidentRate: false,
		rate: 0,
		perPartRate: null,
	},
];
exports.singerServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2v093ty18067ctgy651vbt106tngvg61v',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'singer',
			isRapper: true,
			isSinger: true,
			rappingStyles: ['slow', 'fast', 'trap', 'east coast vibes', 'west coast vibes', 'island', 'uk', 'british'],
			singingRanges: ['baritone', 'super low', 'low', 'mid range'],
			vocalEffects: ['sultry', 'raspy', 'screaming', 'whisper', 'soft'],
		},
		pricing: {
			manualQuotingIsActive: true,
			pricingProfiles: [],
		},
	},
];
exports.singerPricingProfiles = [
	{
		id: 'h12345012ht01c8tnm06nmtg334t3434g',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		type: 'vocals',
		details: {
			name: 'default pricing',
			createdOn: new Date(),
			lastModified: new Date(),
		},
		pricing: {
			isFlatRate: false,
			isLessForBackgroundVocals: false,
			isStructuresByPart: false,
			hasGenreFlatRate: false,
			hasConfidentFlatRate: false,
			flatRate: 0,
			leadVocalRate: 0,
			backgroundVocalRate: 0,
			perPartRate: 0,
			confidentGenres: {
				isFlateRate: false,
				flatRate: 0,
				leadVocalRate: 0,
				perPartRate: null,
				backgroundVocalRate: 0,
				genreRates: [], // fetch from api
			},
			lessExperiencedGenres: {
				isFlateRate: false,
				flatRate: 0,
				leadVocalRate: 0,
				perPartRate: null,
				backgroundVocalRate: 0,
				genreRates: [], // fetch from api
			},
		},
	},
];

// ************ SONGWRITER SERVICE
exports.songwriterServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'c01247tr1036gt1xn34bn1fr7c3c143t',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'songwriter',
			lyrics: {
				isOffering: false,
				emotions: [],
			},
			music: {
				isOffering: false,
				dynamicRating: {
					ambientSoundsAndBeds: 1,
					relaxingAndLaidBack: 4,
					movingAndAwake: 4,
					activeAndFun: 5,
					intenseAndSlow: 5,
					intenseAndFast: 3,
					excitingAndFun: 3,
				},
				contentBoundaries: {
					children: false,
					ratedG: false,
					ratedPG: false,
					ratedPG13: false,
					ratedR: false,
					ratedX: false,
					ratedXXX: false,
				},
			},
		},
		pricing: {
			manualQuotingIsActive: true,
			pricingProfiles: [], //fetch from api
		},
	},
];
exports.songwriterServiceGenreRates = [
	{
		pricingProfileId: '20x84w347iv7iobcngyurny83674368',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'f349014j9p654903760j34379j34',
		genre: 'rock',
		isConfidentRate: true,
		vocalsRate: 0,
		smallIdeaRate: 0,
		largeIdeaRate: 0,
		createdOn: new Date(),
		lastModified: new Date(),
	},
	{
		pricingProfileId: '20x84w347iv7iobcngyurny83674368',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: 'xrh134198cnt1097ct134n0mc65ct',
		genre: 'rap',
		isConfidentRate: true,
		vocalsRate: 0,
		smallIdeaRate: 0,
		largeIdeaRate: 0,
		createdOn: new Date(),
		lastModified: new Date(),
	},
	{
		pricingProfileId: '20x84w347iv7iobcngyurny83674368',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '40278ty2v07gtnc2mx2647gt6c352',
		genre: 'salsa',
		isConfidentRate: false,
		vocalsRate: 0,
		smallIdeaRate: 0,
		largeIdeaRate: 0,
		createdOn: new Date(),
		lastModified: new Date(),
	},
	{
		pricingProfileId: '20x84w347iv7iobcngyurny83674368',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '012cvty80c1gn5x59tgfnv01byg55',
		genre: 'techno',
		isConfidentRate: false,
		vocalsRate: 0,
		smallIdeaRate: 0,
		largeIdeaRate: 0,
		createdOn: new Date(),
		lastModified: new Date(),
	},
];
exports.songwritingPricingProfiles = [
	{
		id: '20x84w347iv7iobcngyurny83674368',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		details: {
			profileName: 'Sale Rates',
			createdOn: new Date(),
			lastModified: new Date(),
		},
		pricing: {
			isFlatRate: true,
			hasGenreFlatRate: false,
			hasConfidentFlatRate: false,
			flatRate: 0,
			confidentGenres: {
				isFlatRate: false,
				vocalsRate: 0,
				smallIdeaRate: 0,
				largeIdeaRate: 0,
				genreRates: [], // fetch from api
			},
			lessExperiencedGenres: {
				isFlatRate: false,
				vocalsRate: 0,
				smallIdeaRate: 0,
				largeIdeaRate: 0,
				genreRates: [], // fetch from api
			},
		},
	},
];

// ************ STUDIO MUSICIAN SERVICE
exports.studioMusicianServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2v05jty0287cmt862v4t2683vn2vb2',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'studio musician',
			instruments: [], // fetch from db when needed
			dynamicRating: {
				ambientSoundsAndBeds: 1,
				relaxingAndLaidBack: 4,
				movingAndAwake: 4,
				activeAndFun: 5,
				intenseAndSlow: 5,
				intenseAndFast: 3,
				excitingAndFun: 3,
			},
		},
		pricing: {
			manualQuotingIsActive: true,
			pricingProfiles: ['34578t73nv0tng53vt68fm18t01f6013vb'], // fetch from api - studioMusicianPricingProfiles
		},
	},
];
exports.studioMusicianPricingProfiles = [
	{
		id: '34578t73nv0tng53vt68fm18t01f6013vb',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		type: 'studioMusician',
		details: {
			name: 'standard rates',
			createdOn: new Date(),
			lastModified: new Date(),
		},
		pricing: {
			isFlatRate: false,
			hasGenreFlateRate: false,
			hasConfidentFlatRate: false,
			instrumentFlatRate: false,
			perInstrument: false,
			perPart: false,
			perSongNeeds: false,
			flatRate: 0,
			perPartRate: 0,
			perInstrumentRate: 0,
			instrumentPricingProfiles: ['134t0jx234ytn478tn2g486'], // fetch from api - instrumentPricingProfiles
		},
	},
];
exports.instrumentPricingProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '134t0jx234ytn478tn2g486',
		createdOn: new Date(),
		lastModified: new Date(),
		name: 'guitar',
		isFlatRate: false,
		flatRate: 0,
		perPartRate: 0,
		perSongRate: 0,
		perInstrumentRate: 0,
		confidentGenres: {
			isFlatRate: false,
			flateRate: 0,
			perPartRate: 0,
			perInstrumentRate: 0,
			genreRates: [], // fetch from api -  studioMusicianServiceGenreRates
		},
		lessExperiencedGenres: {
			isFlatRate: false,
			flateRate: 0,
			perPartRate: 0,
			perInstrumentRate: 0,
			genreRates: [], // fetch from api -  studioMusicianServiceGenreRates
		},
	},
];
exports.studioMusicianServiceGenreRates = [
	{
		belongsToInstrumentPricingProfile: '134t0jx234ytn478tn2g486',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2hyn7ty685t8245902045t27806035',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'rock',
		isConfidentRate: true,
		perPartRate: 0,
		perSongRate: 0,
		perInstrumentRate: 0,
	},
	{
		belongsToInstrumentPricingProfile: '134t0jx234ytn478tn2g486',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '90345t0247yntv2865gct246tg24525634',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'piano',
		isConfidentRate: false,
		perPartRate: 0,
		perSongRate: 0,
		perInstrumentRate: 0,
	},
];

// ************ PRODUCER SERVICE
exports.producerServiceProfiles = [
	{
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2vn90ty20c67yctm064tg456tng45',
		createdOn: new Date(),
		lastModified: new Date(),
		serviceDetails: {
			type: 'producer',
			emotionsAndFeelings: [],
			dynamicRating: {
				ambientSoundsAndBeds: 1,
				relaxingAndLaidBack: 4,
				movingAndAwake: 4,
				activeAndFun: 5,
				intenseAndSlow: 5,
				intenseAndFast: 3,
				excitingAndFun: 3,
			},
			contentBoundaries: {
				children: false,
				ratedG: false,
				ratedPG: false,
				ratedPG13: false,
				ratedR: false,
				ratedX: false,
				ratedXXX: false,
			},
		},
		pricing: {
			manualQuotingIsActive: true,
			pricingProfiles: [], // fetch from api
		},
	},
];
exports.producingServiceGenreRates = [
	{
		pricingProfileId: '2v59y872tcn4524x5j5jnm2cn26589',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '2790v5yn78ty2c034gt2c562',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'rock',
		isConfidentRate: true,
		contributionRate: 0,
		smallProductionRate: 0,
		largeProductionRate: 0,
	},
	{
		pricingProfileId: '2v59y872tcn4524x5j5jnm2cn26589',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		id: '27890nt2078yt2c08t245m9t625c',
		createdOn: new Date(),
		lastModified: new Date(),
		genre: 'rock',
		isConfidentRate: true,
		contributionRate: 0,
		smallProductionRate: 0,
		largeProductionRate: 0,
	},
];
exports.producerPricingProfiles = [
	{
		id: '2v59y872tcn4524x5j5jnm2cn26589',
		userId: '892d3658927tbcr82o36gf93g623456f2gb',
		type: 'producing',
		details: {
			profileName: 'Normal Rates',
			createdOn: new Date(),
			lastModified: new Date(),
		},
		pricing: {
			isFlatRate: false,
			hasFlatContributionRate: false,
			hasFromScratchRate: false,
			hasGenreFlateRate: false,
			hasConfidentFlatRate: false,
			flatRate: 0,
			flateContributionRate: 0,
			fromScratchRate: 0,
			confidentGenres: {
				isFlatRate: false,
				flateRateSmallProduction: 0,
				flateRateLargeProduction: 0,
				hasContributionRate: false,
				contributionRate: 0,
				genreRates: [], // fetch from api
			},
			lessExperiencedGenres: {
				isFlatRate: false,
				flateRateSmallProduction: 0,
				flateRateLargeProduction: 0,
				hasContributionRate: false,
				contributionRate: 0,
				genreRates: [], // fetch from api
			},
		},
	},
];
