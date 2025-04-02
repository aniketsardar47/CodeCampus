const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {userDetails,addAssignment, fetchAssignments, fetchSubmissions,pending_completed_Assignments} = require('../controllers/userController');

router.get("/user",authMiddleware,userDetails);
router.post('/addAssignment',authMiddleware,addAssignment);
router.get('/fetchAssignment',authMiddleware,fetchAssignments);
router.get('/fetchSubmissions',authMiddleware,fetchSubmissions);
router.get('/pending_completed_Assignments',authMiddleware,pending_completed_Assignments);

module.exports = router;