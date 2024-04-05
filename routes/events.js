const express = require('express');
const router = express.Router();
const Event = require("../models/Events");




router.delete(
"/events/:eventId",
async (req, res) => {
let success = false;

// Extract event ID from request parameters
const { eventId } = req.params;

// Check if eventId is provided
if (!eventId) {
return res.status(400).json({ success: false, error: "Event ID is required." });
}

try {
// Delete event document
await Event.findByIdAndDelete(eventId);

success = true;
res.json({ success });
} catch (error) {
console.log(error);
res.status(500).send("Internal Server Error");
}
}
);

module.exports = router;
