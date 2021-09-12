const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tempHumidity = require('../controllers/tempHumidity')

router.get("/", auth, tempHumidity.getTempHumidity)

module.exports = router;