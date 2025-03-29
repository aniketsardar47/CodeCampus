const mongoose = require('mongoose')

const submissionSchema = mongoose.Schema({
    "assignment" : {type: mongoose.Schema.ObjectId,required: true},
    "student" : {type:mongoose.Schema.ObjectId,required: true},
    "status": {type:Boolean,required: true}
},{timestamps:true}
)

module.exports = mongoose.model("Submission",submissionSchema);