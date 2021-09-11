const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const userCtrl = require('../controllers/user.js')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.userProfil);
router.put('/update/:uuid',auth , userCtrl.changePwd);
router.delete('/delete/:uuid', auth , userCtrl.deleteProfile)
router.get('/admin/:uuid', auth, userCtrl.getAll)

module.exports = router;