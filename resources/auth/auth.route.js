const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');

router.get(
  '/',
  (req, res) => {
    logger.info('Auth');
    console.log(res);
    //res.send(`This is simpleValidator with baseUrl: ${req.baseUrl}`);
    res.json({
      auth:true,
      code:200,
      last_access: '2020-05-11 04:11'
    });
  }
);

module.exports = router;