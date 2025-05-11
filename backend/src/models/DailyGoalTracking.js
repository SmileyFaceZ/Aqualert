import mongoose from "mongoose";

const dailyGoalTrackingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    goal_ml: {
      type: Number,
      required: true
    },
    consumed_ml: {
      type: Number,
      default: 0
    },
    goal_achieved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const DailyGoalTracking = mongoose.model("DailyGoalTracking", dailyGoalTrackingSchema);

export default DailyGoalTracking;