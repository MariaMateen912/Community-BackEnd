const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    firstName:{
        type: String,
        required : true
    },
    
    lastName:{
        type: String,
        required : true
    },
    emailId:{
        type: String,
        required : true,
        unique :true
       
    },
    voterId:{
        type: String,
        required : true,
        unique : true
    },
    mobileNo:{
        type: String,
        required : true
        
    },
    
    password:{
        type: String,
        required : true
    },
    role:{
        type:String,
        required:true

        
    }

})
module.exports = mongoose.model('user',UserSchema);