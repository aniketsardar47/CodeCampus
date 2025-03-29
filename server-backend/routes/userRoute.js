const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
import {userDetails} from require('../controllers/userController');



router.get("/user",authMiddleware,userDetails);

module.exports = router;