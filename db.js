const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/CommunityForum";

const connectToMongo = () => {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log("Connected to Mongo");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

module.exports = connectToMongo;
