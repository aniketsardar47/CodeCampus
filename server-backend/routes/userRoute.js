const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {userDetails} = require('../controllers/userController');



router.get("/user",authMiddleware,userDetails);

module.exports = router;