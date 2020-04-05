const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');

router.get(
  '/',
  (req, res) => {
    logger.info('Simple Validatos Route');
    res.send(`This is simpleValidator with baseUrl: ${req.baseUrl}`);
    return true;
  }
);

module.exports = router;