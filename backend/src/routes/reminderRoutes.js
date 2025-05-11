import express from "express";
import Reminder from "../models/Reminder.js";

const router = express.Router();

// Get all reminders for a user
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const reminders = await Reminder.find({ user_id }).sort("scheduled_time");
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders." });
  }
});

// Create a new reminder
router.post("/", async (req, res) => {
  const { user_id, scheduled_time, water_size } = req.body;

  if (!user_id || !scheduled_time || !water_size) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const reminder = new Reminder({
      user_id,
      scheduled_time,
      water_size,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reminder." });
  }
});

// Delete a reminder
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reminder." });
  }
});

export default router;
