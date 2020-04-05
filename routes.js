/* eslint-disable global-require */
const express = require('express');
const pathLib = require('path');
const glob = require('glob');

const logger = require('./utils/logger');

const matches = glob.sync(pathLib.join(__dirname, 'resources/*/*.route.js'));
if (!matches) {
  throw new Error('No controllers founds in the current project');
}
const routerV1 = express.Router();
//const routerV2 = express.Router();

routerV1.get('/v1', (req, res) => {
  res.status(200).send('API-APP-TTE V1');
});
routerV1.head('/', (req, res) => {
  res.status(200).send('API-APP-TTE V1');
});

matches.forEach(item => {
  const pathParsed = pathLib.parse(item);
  routerV1.use(`/v1/${pathParsed.base.split('.')[0]}`, require(item));
  logger.debug(`route [/v1/${pathParsed.base.split('.')[0]}] added`);
});

module.exports = { v1: routerV1 };