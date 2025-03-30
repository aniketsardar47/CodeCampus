const Assignment = require('../models/Assignment');
const User = require('../models/Users');

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

const addAssignment = async (req,res)=> {
    const {assignor,title,description,due} = req.body;
    console.log(assignor);
    try{
        const assignExists = await Assignment.findOne({title});
        if(assignExists){
            res.status(400).json({ message: "Assignment already exists" });
        }
        const assignment = await Assignment.create({assignor,title,description,due});

        res.status(201).json({
            _id : assignment._id,
            assignor: assignment.assignor,
            title: assignment.email,
            description : assignment.role,
            due: assignment.due,
        })
    }catch(error){
        console.log("Error creating assignment: ",error);
        res.status(500).json({message:"Server error!"});
    }
}

module.exports = {userDetails,addAssignment};