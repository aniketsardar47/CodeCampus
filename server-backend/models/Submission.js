const mongoose = require('mongoose')

const submissionSchema = mongoose.Schema({
    "assignment" : {type: mongoose.Schema.ObjectId,ref:'Assignment',required: true},
    "student" : {type:mongoose.Schema.ObjectId,ref:'User',required: true},
    "status": {type:Boolean,required: true},
    "submission_date": {type:Date}
},{timestamps:true}
)

module.exports = mongoose.model("Submission",submissionSchema);