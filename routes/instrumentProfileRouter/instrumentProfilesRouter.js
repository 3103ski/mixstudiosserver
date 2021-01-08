const express = require('express');

const instrumentProfiles = require('./instrumentRouters/instrumentProfilesRouter');
const instrumentPricing = require('./instrumentRouters/instrumentPricingRouter');

const instrumentProfilesRouter = express.Router();

instrumentProfilesRouter.use('/', instrumentProfiles);
instrumentProfilesRouter.use('/pricing-profiles', instrumentPricing);

module.exports = instrumentProfilesRouter;
