const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/Users');
const mongoose = require('mongoose')

const userDetails = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        res.json(user);
    }catch(error){
        console.log("Error fetching user:" ,error);
        res.status(500).json({message:"Server error!"});
    }
}

const fetchSubmissions = async (req,res) => {
    try{
        const data = await Submission.find({assignment:req.query.id}).populate('student').populate('assignment');
        res.json(data);
    }catch(error){
        console.log("Error fetching submissions: ",error);
        res.status(500).json({message:"Server error!"});
    }
}

const addAssignment = async (req,res)=> {
    const {assignor,teacher,title,description,due} = req.body;
    try{
        const assignExists = await Assignment.findOne({title});
        if(assignExists){
            res.status(400).json({ message: "Assignment already exists" });
        }
        const new_ass = await Assignment.create({assignor,teacher,title,description,due});

        const students = await User.find({role:"Student"});
        const submissions = students.map(student=> ({
            assignment : new_ass._id,
            student: student._id,
            status: false,
            submission_date : "",
            code: "",
            output: "",
            lock : false
        }));

        await Submission.insertMany(submissions);

        res.status(201).json({
           message : "Assignment created and submissions initialized!"
        })
    }catch(error){
        console.log("Error creating assignment: ",error);
        res.status(500).json({message:"Server error!"});
    }
}

const fetchAssignments = async (req,res) => {
    try{
        const assignments = await Assignment.find();
        res.json(assignments);
    }catch(error){
        console.log("Error fetching assignments: ",error);
        res.status(500).json({message:"Server error!"});
    }
}

const pending_completed_Assignments = async (req,res) => {
    try{
        const user_id = req.user.id;
        const pending = await Submission.find({student:user_id,status : false}).populate('assignment');
        const completed = await Submission.find({student : user_id,status : true}).populate('assignment');
        res.json({pending,completed});
    }catch(error){
        console.log("Error fetching assignments: ",error);
        res.status(500).json({message:"Server error!"});
    }
}

const updateLock = async (req,res) => {
    try{
        let {submissionId,key} = req.body;

        if (!submissionId) {
            return res.status(400).json({ message: "Invalid ID" });
          }

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
          }

        if(submission.lock != key){
        await Submission.updateOne({_id:submission._id},{$set:{lock: key}})
        }
        res.status(201).json({
            message: "Lock updated!"
        });
    }
    catch(error){
        console.log("Error updating: ",error);
        res.status(500).json({error: "Internal Server Error"})
    }
}


module.exports = {userDetails,addAssignment,fetchAssignments,fetchSubmissions,pending_completed_Assignments,updateLock};