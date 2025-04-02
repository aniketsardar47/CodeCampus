const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema(
    {
       assignor : {type : mongoose.Schema.ObjectId ,ref:'User', required : true},
       teacher: {type: String, required: true},
       title : {type : String, required : true,unique:true},
       description : {type : String, required : true},
       due: {type: Date, required:true},
    },{timestamps:true}
);

module.exports = mongoose.model("Assignment",assignmentSchema);