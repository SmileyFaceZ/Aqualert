import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Profile update route
router.put("/profile", async (req, res) => {
  try {
    const { userId, firstname, lastname, birthdate, gender, weight, height } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.birthdate = birthdate || user.birthdate;
    user.gender = gender || user.gender;
    user.weight = weight || user.weight;
    user.height = height || user.height;

    const updatedUser = await user.save();

    res.status(200).json({
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
