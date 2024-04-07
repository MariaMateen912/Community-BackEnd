const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Grievance = require("../models/Grievance");
const Notice = require("../models/Notice");
const Event = require("../models/Events");
const ImageDetail = require("../models/ImageDetail");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Thisprojectissecured";

console.log("Hello Arif");

//  ROUTE 1 :Registration route
router.post(
  "/register",

  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ emailId: req.body.emailId });
      if (user) {
        return res.status(400).json({ success, error: "Email already in use" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        voterId: req.body.voterId,
        mobileNo: req.body.mobileNo,
        password: secPass,
        role: req.body.role,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: login route
router.post(
  "/login",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const emailId = req.body.username;
    const password = req.body.password;
    try {
      console.log(emailId);
      let user = await User.findOne({ emailId });
      if (!user) {
        return res
          .status(400)
          .json({
            error: "Please try to login with correct credentials email",
          });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            error: "Please try to login with correct credentials password",
          });
      }

      // Now you can generate and send a token for successful login
      const data = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken, role: user.role });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 3: Grievance submission route
router.post(
  "/submit-grievance",
  fetchuser, // Middleware to fetch user details from JWT
  async (req, res) => {
    try {
      const { location, subject, complain, suggestion } = req.body;

      // Create a new grievance object
      const grievance = new Grievance({
        location,
        subject,
        complain,
        suggestion,
        user: req.user.id, // Associate the grievance with the current user
      });

      // Save the grievance to the database
      await grievance.save();

      res.json({ success: true, grievance });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 4: Notice submission route
router.post(
  "/submit-notice",
  fetchuser, // Middleware to fetch user details from JWT
  async (req, res) => {
    try {
      const { meetingDate, agenda, place, whom } = req.body;

      // Create a new grievance object
      const notice = new Notice({
        meetingDate,
        agenda,
        place,
        whom,
        user: req.user.id, // Associate the grievance with the current user
      });

      // Save the grievance to the database
      await notice.save();

      res.json({ success: true, notice });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/notices", async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json({ success: true, notices });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete-notice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);
    if (!deletedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found" });
    }
    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/saveAttendance", async (req, res) => {
  try {
    const { attendance } = req.body;

    // Here you can update the attendance data in your database
    // For example, if you have a Notice model, you can update the attendance field for each notice

    // Loop through each notice and update the attendance
    for (const noticeId in attendance) {
      await Notice.findByIdAndUpdate(noticeId, {
        attendance: attendance[noticeId],
      });
    }

    console.log("Attendance saved successfully");
    res.json({ success: true, message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get attendance statistics for a specific meeting
router.get("/attendance/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Notice.findById(meetingId);
    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    // Count the number of attendees selecting "Attending" and "Not Attending"
    const attendingCount = meeting.attendance.filter(
      (a) => a === "Attending"
    ).length;
    const notAttendingCount = meeting.attendance.filter(
      (a) => a === "Not Attending"
    ).length;

    res.json({ success: true, meetingId, attendingCount, notAttendingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/events", async (req, res) => {
  let success = false;
  console.log(req.body);
  // Extract event details from request body
  const { title, start } = req.body;

  try {
    // Create new event document
    const event = await Event.create({
      title,
      start,
    });

    success = true;
    res.json({ success, event });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    Image.create({ image: base64 });
    res.send({ Status: "ok" });
  } catch (error) {
    res.send({ Status: "error", data: error });
  }
});

//Export the router
module.exports = router;
