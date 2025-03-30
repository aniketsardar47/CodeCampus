const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema(
    {
       assignor : {type : mongoose.Schema.ObjectId , required : true},
       title : {type : String, required : true,unique:true},
       description : {type : String, required : true},
       due: {type: Date, enum: ["Student","Teacher"]},
    },{timestamps:true}
);

module.exports = mongoose.model("Assignment",assignmentSchema);