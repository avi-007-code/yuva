const express = require('express');
const router = express.Router();

const { adminRegister, adminLogin } = require("../controllers/authController");
const { verifyAdmin } = require('../middleware/authenticateMiddleware');



router.post('/register',adminRegister);
router.post('/login',adminLogin);

// verify token route (used by frontend ProtectedRoute)
router.get("/verify", verifyAdmin, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});


module.exports = router;