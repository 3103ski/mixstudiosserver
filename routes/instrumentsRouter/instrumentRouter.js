const express = require('express');

const instrumentProfiles = require('./instrumentRoutes/instrumentProfilesRouter');
const instrumentPricing = require('./instrumentRoutes/instrumentPricingProfileRouter');

const instrumentProfilesRouter = express.Router();

instrumentProfilesRouter.use('/', instrumentProfiles);
instrumentProfilesRouter.use('/pricing-profiles', instrumentPricing);

module.exports = instrumentProfilesRouter;
