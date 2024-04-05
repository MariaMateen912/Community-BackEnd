const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  
});

module.exports = mongoose.model('events',EventsSchema);
 // Export as 'Event', not 'events'
