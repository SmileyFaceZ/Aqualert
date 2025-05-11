import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduled_time: {
      type: Date,
      required: true,
    },
    water_size: {
      type: Number,
      required: true,
    },
    is_notified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model("Reminder", reminderSchema);

export default Reminder;
