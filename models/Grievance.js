const mongoose = require('mongoose');
const { Schema } = mongoose;
const GrievanceSchema = new Schema({
    location: {
        type: String,
        enum: ['nibmRd', 'kausarBaug', 'pargeNagar'], // Define the possible values 
        required: true
    },
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