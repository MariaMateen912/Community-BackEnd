const express =require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Grievance = require("../models/Grievance");

// Route to fetch all grievances
router.get('/get-grievances', async (req, res) => {
    try {
      const grievances = await Grievance.find();
      res.json({ success: true, grievances });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports= router