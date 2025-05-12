import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkTokenValid = async (logout) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) return false;

    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    logout();
    return false;
  }
};
