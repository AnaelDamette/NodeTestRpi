const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');


router.get("/", auth, postCtrl.listMsg);
router.get("/mesMessages/:uuid", auth, postCtrl.listMesMsg);
router.post("/create/:uuid", auth, postCtrl.createMsg);
router.delete('/delete/:uuid', auth, postCtrl.deleteMsg);
router.put("/update/:uuid", auth, postCtrl.updateMsg);

module.exports = router;