const mongoose = require('mongoose');
const { Schema } = mongoose;
const ImageDetailSchema = new Schema({

    image:{
        type:String
    },
    


})
module.exports = mongoose.model('imagedetail',ImageDetailSchema);