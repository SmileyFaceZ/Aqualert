import { API_URL } from "../constants/api.js";
import { create } from "zustand";

export const useReminderApp = create((set) => ({
  reminders: [],
  isLoading: false,
  getReminders: async (user_id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/reminders?user_id=${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      const data = await response.json();
      set({ reminders: data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error fetching reminders:", error);
    }
  },
}));
