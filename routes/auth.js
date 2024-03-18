const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Grievance = require("../models/Grievance");
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
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ emailId: req.body.emailId });
      if (user) {
        return res.status(400).json({success, error: "Email already in use" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        voterId: req.body.voterId,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
        password: secPass,
        role : req.body.role,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authoken });
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

    const emailId  = req.body.username;
    const password = req.body.password;
    try {
      console.log(emailId);
      let user = await User.findOne({ emailId });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials email" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials password" });
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
      const { subject, complain, suggestion } = req.body;

      // Create a new grievance object
      const grievance = new Grievance({
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








// Export the router
module.exports = router;
