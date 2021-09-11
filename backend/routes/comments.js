const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentsCtrl = require('../controllers/comments');


router.post("/create/:uuid", auth, commentsCtrl.createComments)
router.delete("/delete/:uuid", auth, commentsCtrl.deleteComments)

module.exports = router;