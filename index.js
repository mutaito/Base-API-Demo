require("dotenv").config();

const express = require("express");

const logger = require('./utils/logger');
const routes = require('./routes.js');

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() !== "development") {
  logger.info(`process.env.NODE_ENV =  [${process.env.NODE_ENV}].`);
}
logger.info("Starting Api ...");

const app = express();
//app.use(bodyparser.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Content-Type", "application/json");
  return next();
});

app.use('/api', routes.v1);
app.use('/api/v1', routes.v1);
app.use('/public', express.static('public'));

const PORT = process.env.PORT || process.env.port || 3001;
const server = app.listen(PORT, () => {
  logger.info(`Listening on the port [${PORT}]...`);
});
