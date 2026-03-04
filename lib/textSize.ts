import type { TextStyle } from "react-native";

type TextSizeKey = "small" | "medium" | "large" | "extra_large";

const SCALE_FACTORS: Record<TextSizeKey, number> = {
  small: 0.875,
  medium: 1.0,
  large: 1.125,
  extra_large: 1.25,
};

const BASE_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
} as const;

export type BaseSize = keyof typeof BASE_SIZES;

export function getScaledFontSize(
  textSize: TextSizeKey,
  base: BaseSize = "base"
): number {
  return Math.round(BASE_SIZES[base] * SCALE_FACTORS[textSize]);
}

export function getTextSizeStyle(
  textSize: TextSizeKey,
  base: BaseSize = "base"
): TextStyle {
  return { fontSize: getScaledFontSize(textSize, base) };
}
