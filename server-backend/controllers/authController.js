const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req,res) => {
    const {name,email,password,role} = req.body;

    try{
        console.log("entered");
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashPassword = await bcrypt.hash(password,10);
        console.log("fine")
        const user = await User.create({name,email,password: hashPassword,role});

        res.status(201).json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            token: generateToken(user)
        })
    } 
    catch(error){
        res.status(500).json({message:"Server Error"})
    }
};

const loginUser = async (req,res) => {
    const {email,password} = req.body;

    try{
        console.log("request received") 

        const user = await User.findOne({email});
        if (!user){
            console.log("user not exist");
            return res.status(400).json({message:"Invalid Credentials"});
        }
        
        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            console.log("incorrect");
            return res.status(400).json({message:"Invalid Credentials"});
        }

        res.json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            token: generateToken(user)
        });
    } catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

module.exports = {registerUser,loginUser};