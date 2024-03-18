const express = require('express');
const router = express.Router();
const Event = require("../models/Events");

router.post(
  "/events/:eventId",
  async (req, res) => {
    let success = false;
    

    // Extract event details from request body
    const { title, start, end } = req.body;

    try {
      // Create new event document
      const event = await Event.create({
        title,
        start,
        end,
      });

      success = true;
      res.json({ success, event });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
// router.put(
//   "/events/:eventId",
//   async (req, res) => {
//     let success = false;

//     // Extract event ID and updated details from request body
//     const { eventId } = req.params;
//     const { title, start, end } = req.body;

//     // Check if eventId is provided
//     if (!eventId) {
//       return res.status(400).json({ success: false, error: "Event ID is required." });
//     }

//     try {
//       // Update event document
//       const updatedEvent = await Event.findByIdAndUpdate(
//         eventId,
//         { title, start, end },
//         { new: true }
//       );

//       success = true;
//       res.json({ success, updatedEvent });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

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