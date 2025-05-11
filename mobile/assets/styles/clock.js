import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  clockCard: {
    backgroundColor: "#fff",
    marginVertical: 12,
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  clockTime: {
    fontSize: 22,
    fontWeight: "500",
    color: "#007AFF",
  },
  saveButton: {
    backgroundColor: "#5A9BF6",
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  // saveButton: {
  //   position: "absolute",
  //   bottom: 30,
  //   left: 20,
  //   right: 20,
  //   backgroundColor: "#007AFF",
  //   paddingVertical: 16,
  //   borderRadius: 25,
  //   alignItems: "center",
  //   shadowColor: "#007AFF",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   elevation: 5,
  // },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
  },
  pickerContainer: {
    paddingHorizontal: 20,
  },

  pickerLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  bottleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  bottleCard: {
    width: "47%",
    backgroundColor: "#EAF2FF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bottleCardSelected: {
    backgroundColor: "#5A9BF6",
  },

  bottleLabel: {
    marginTop: 8,
    fontSize: 16,
    color: "#5A9BF6",
    fontWeight: "500",
  },

  bottleLabelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  reminderItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  reminderInactive: {
    backgroundColor: "#ECECEC",
  },

  reminderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  reminderIcon: {
    backgroundColor: "#E0EDFF",
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
  },

  reminderTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  reminderText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  reminderStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },

  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

export default styles;
