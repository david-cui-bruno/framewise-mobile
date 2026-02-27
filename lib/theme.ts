import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "user-theme-preference";

export type ThemePreference = "light" | "dark" | "system";

export async function loadThemePreference(): Promise<ThemePreference> {
  try {
    const value = await AsyncStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }
    return "system";
  } catch {
    return "system";
  }
}

export async function saveThemePreference(
  preference: ThemePreference
): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, preference);
  } catch (error) {
    console.error("Failed to save theme preference:", error);
  }
}
