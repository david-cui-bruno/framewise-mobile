import { Platform } from "react-native";

// Shadow styles for light mode
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 9,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
};

// Shadow styles for dark mode
export const darkShadows = {
  sm: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.45,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 14,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 11,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }),
};

// Progress ring colors (for SVG components)
export const ringColors = {
  bg: "#CFEFF7",
  progress: "#4E9FBA",
  bgTasks: "#D2DDD6",
  progressTasks: "#26B866",
};

export const darkRingColors = {
  bg: "#245463",
  progress: "#4FB7D3",
  bgTasks: "#47514C",
  progressTasks: "#26B866",
};

// Color palette (matching Tailwind config)
export const colors = {
  primary: {
    50: "#E9F7FB",
    100: "#CFEFF7",
    200: "#A7E0EE",
    300: "#74CBE2",
    400: "#4FB7D3",
    500: "#4E9FBA",
    600: "#3F88A2",
    700: "#2F6A7F",
    800: "#245463",
    900: "#1E4552",
  },
  neutral: {
    0: "#FFFFFF",
    25: "#F7FAF8",
    50: "#F1F5F2",
    100: "#E4ECE6",
    200: "#D2DDD6",
    300: "#B9C7BF",
    400: "#9AA99F",
    500: "#7C8A82",
    600: "#5F6B64",
    700: "#47514C",
    800: "#2F3733",
    900: "#1A1F1D",
  },
  success: {
    50: "#EAF7EF",
    100: "#D0F0DB",
    200: "#A3E2B8",
    500: "#26B866",
    600: "#1F8A4C",
    700: "#177A3E",
  },
  warning: {
    50: "#FFF6E7",
    100: "#FFEDD0",
    500: "#D97706",
    600: "#A86100",
  },
  error: {
    50: "#FFECEC",
    100: "#FFDADA",
    200: "#FFC4C4",
    500: "#DC2626",
    600: "#B42318",
  },
};

// Helper to get shadow style based on color scheme
export const getShadow = (isDark: boolean, type: keyof typeof shadows) => {
  return isDark ? darkShadows[type] : shadows[type];
};

// Helper to get ring colors based on color scheme
export const getRingColors = (isDark: boolean) => {
  return isDark ? darkRingColors : ringColors;
};
