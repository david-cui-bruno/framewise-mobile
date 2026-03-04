import { Platform } from "react-native";

export { colors } from "./colors";

// Shadow styles
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#0B1220",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#0B1220",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 16,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#0B1220",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
};

// Progress ring colors (for SVG components)
export const ringColors = {
  bg: "#EAF5FF",
  progress: "#067BF5",
  bgTasks: "#D6E3F0",
  progressTasks: "#95CC71",
};

// Helper to get shadow style
export const getShadow = (type: keyof typeof shadows) => shadows[type];

// Helper to get ring colors
export const getRingColors = () => ringColors;
