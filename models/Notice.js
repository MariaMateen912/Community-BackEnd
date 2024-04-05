const mongoose = require('mongoose');
const { Schema } = mongoose;
const NoticeSchema = new Schema({
    meetingDate: {
        type: Date,
        required: true
    },
   agenda:{
        type: String,
        required : true
    },
   place:{
        type: String,
        required : true
    },
    whom:{
        type: String,
        required : true
    },
    


})
module.exports = mongoose.model('notice',NoticeSchema);