const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {userDetails,addAssignment} = require('../controllers/userController');

router.get("/user",authMiddleware,userDetails);
router.post('/addAssignment',authMiddleware,addAssignment);

module.exports = router;