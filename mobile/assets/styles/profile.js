import { StyleSheet } from "react-native";

const COLORS = {
  background: "#E8F4FD",
  primary: "#0f80fd",
  textDark: "#141a1e",
  textLight: "#797979",
  inputBg: "#f3f3f3",
  border: "#E5E5E5",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8FB",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  editIcon: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: "#6EC6F2",
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 4,
    color: "#000",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#6EC6F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  genderLabel: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  genderLabelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0E8F2",
  },
  waterText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  waterHighlight: {
    fontWeight: "bold",
    color: "#6EC6F2",
  },
});

export default styles;
