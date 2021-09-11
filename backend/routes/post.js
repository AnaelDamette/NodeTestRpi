const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');


router.get("/", auth, postCtrl.listMsg);
router.get("/mesMessages/:uuid", auth, postCtrl.listMesMsg);
router.post("/create/:uuid", auth, multer, postCtrl.createMsg);
router.delete('/delete/:uuid', auth, postCtrl.deleteMsg);
router.put("/update/:uuid", auth, multer, postCtrl.updateMsg);

module.exports = router;