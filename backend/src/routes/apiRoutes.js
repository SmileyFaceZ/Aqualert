import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import DailyGoalTracking from "../models/DailyGoalTracking.js";

const router = express.Router();

// USER ROUTES
// GET: Get current user profile
router.get("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in GET /me:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update current user profile
router.put("/users/me", auth, async (req, res) => {
  try {
    const updates = req.body;

    const allowedFields = ["username", "email"];
    const filteredUpdates = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in PUT /me:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// WATER TRACKING ROUTES
// GET: Get today's water tracking data
router.get("/water/today", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let tracking = await DailyGoalTracking.findOne({
      user_id: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!tracking) {
      // Create new tracking for today with default goal
      tracking = new DailyGoalTracking({
        user_id: req.user.id,
        goal_ml: 2000 // Default goal
      });
      await tracking.save();
    }
    
    res.json(tracking);
  } catch (error) {
    console.error("Error in GET /water/today:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Add water intake
router.post("/water/intake", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ message: "Valid amount required" });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let tracking = await DailyGoalTracking.findOne({
      user_id: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!tracking) {
      tracking = new DailyGoalTracking({
        user_id: req.user.id,
        goal_ml: 2000,
        consumed_ml: amount
      });
    } else {
      tracking.consumed_ml += amount;
    }
    
    // Check if goal achieved
    tracking.goal_achieved = tracking.consumed_ml >= tracking.goal_ml;
    
    await tracking.save();
    res.json(tracking);
  } catch (error) {
    console.error("Error in POST /water/intake:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Get weekly stats
router.get("/water/weekly", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weeklyData = await DailyGoalTracking.find({
      user_id: req.user.id,
      date: {
        $gte: startOfWeek,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).sort({ date: 1 });
    
    res.json(weeklyData);
  } catch (error) {
    console.error("Error in GET /water/weekly:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT: Update water goal
router.put("/water/goal", auth, async (req, res) => {
  try {
    const { goal_ml } = req.body;
    
    if (!goal_ml || typeof goal_ml !== 'number' || goal_ml < 100) {
      return res.status(400).json({ message: "Valid goal amount required (minimum 100ml)" });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let tracking = await DailyGoalTracking.findOne({
      user_id: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (!tracking) {
      tracking = new DailyGoalTracking({
        user_id: req.user.id,
        goal_ml: goal_ml
      });
    } else {
      tracking.goal_ml = goal_ml;
      // Recalculate goal achievement
      tracking.goal_achieved = tracking.consumed_ml >= goal_ml;
    }
    
    await tracking.save();
    res.json(tracking);
  } catch (error) {
    console.error("Error in PUT /water/goal:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;