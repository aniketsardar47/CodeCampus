const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {userDetails,addAssignment, fetchAssignments} = require('../controllers/userController');

router.get("/user",authMiddleware,userDetails);
router.post('/addAssignment',authMiddleware,addAssignment);
router.get('/fetchAssignment',authMiddleware,fetchAssignments);

module.exports = router;