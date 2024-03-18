const mongoose = require('mongoose');
const { Schema } = mongoose;
const GrievanceSchema = new Schema({
   subject:{
        type: String,
        required : true
    },
   complain:{
        type: String,
        required : true
    },
    suggestion:{
        type: String,
        required : true
    },


})
module.exports = mongoose.model('grievance',GrievanceSchema);