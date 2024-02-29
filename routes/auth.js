const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET = "Thisprojectissecured";

console.log("Hello Arif");

//  ROUTE 1 :Registration route
router.post(
  "/register",
  [
    body("firstName").isLength({ min: 5 }),
    body("lastName").isLength({ min: 5 }),
    body("emailId").isEmail(),
    body("voterId").isLength({ min: 9 }),
    body("mobileNo").isLength({ min: 13 }),
    body("address").isLength({ min: 5 }),
    body("password").isLength({ min: 7 }),
  ],
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
  [
    body("emailId", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailId, password } = req.body;
    try {
      let user = await User.findOne({ emailId });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Now you can generate and send a token for successful login
      const data = {
        user: {
          id: user.id,
        },
      };
      const authoken = jwt.sign(data, JWT_SECRET);
      res.json({ authoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);


//Route3:Get loggedIn UserDetails using :POST Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Use req.user.id to get the user ID
    const user = await User.findById(userId).select("-password");
    res.send(user) // Send the user details in the response
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


// Export the router
module.exports = router;
