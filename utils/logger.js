const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment-timezone');

moment.tz.setDefault(process.env.DEFAULT_TIMEZONE || 'America/Santiago');

/*
Levels:
error   -> 0
warn    -> 1
info    -> 2
verbose -> 3
debug   -> 4
silly   -> 5
*/

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.printf(msg => `${moment().format()} - ${msg.level}: ${msg.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL_CONSOLE || 'debug',
      handleExceptions: true,
      format: winston.format.colorize({ all: true })
    })/*,
    new winston.transports.DailyRotateFile({
      filename: `${__dirname}/../logs/%DATE%-apiapptte.log`,
      datePattern: 'YYYYMMDD',
      level: process.env.LOG_LEVEL_FILE || 'debug',
      // maxFiles: 5,
      // maxsize: 5120000,
      handleExceptions: true
    })*/
  ]
});

