const User = require('../models/Users');
const jwt = require('jsonwebtoken');

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

module.exports = {userDetails};