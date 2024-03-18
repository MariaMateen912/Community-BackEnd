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
  end: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Event', EventsSchema, 'events');
 // Export as 'Event', not 'events'
