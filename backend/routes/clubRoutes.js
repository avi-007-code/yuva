const express = require("express");
const { clubRegister } = require("../controllers/authController");
const router = express.Router();

router.post('/register',clubRegister);
// router.post('/login',clubLogin);

module.exports = router;