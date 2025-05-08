import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FA",
    padding: 24,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#B3D9F5",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#555",
  },
  signupLink: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
});

export default styles;