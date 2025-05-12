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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 60,
  },
  topBanner: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  heroImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    elevation: 2,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  sectionHalf: {
    flex: 1,
  },
  nextButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
});

export default styles;
