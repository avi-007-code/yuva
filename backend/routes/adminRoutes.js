const express = require('express');
const router = express.Router();
const {verifyAdmin} = require('../middleware/authenticateMiddleware')
const { adminRegister, adminLogin } = require("../controllers/authController");
const { viewUser, viewAllClubs, viewClub, deleteClub, deleteUser, viewAllUsers } = require('../controllers/adminController');



router.post('/register',adminRegister);
router.post('/login',adminLogin);
router.get('/viewAllUsers',verifyAdmin,viewAllUsers);
router.get('/viewUser/:id',verifyAdmin,viewUser);
router.get('/viewAllClubs',viewAllClubs);
router.get('/viewClub/:id',verifyAdmin,viewClub);
router.delete('/deleteClub/:id',verifyAdmin,deleteClub);
router.delete('/deleteUser/:id',verifyAdmin,deleteUser);


// verify token route (used by frontend ProtectedRoute)
router.get("/verify", verifyAdmin, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});


module.exports = router;