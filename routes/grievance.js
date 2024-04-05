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




  // Route to delete a grievance
router.delete('/delete-grievance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGrievance = await Grievance.findByIdAndDelete(id);
    if (!deletedGrievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }
    res.json({ success: true, message: 'Grievance deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


module.exports= router