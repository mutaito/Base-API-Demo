const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');

router.get(
  '/',
  (req, res) => {
    logger.info('Logistic Validator /');
    res.send(`BaseUrl: ${req.baseUrl}`);
    return true;
  }
);

module.exports = router;