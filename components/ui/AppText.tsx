import { Text, type TextProps } from "react-native";
import { useTextSize } from "@/contexts/TextSizeContext";
import type { BaseSize } from "@/lib/textSize";

type TextVariant =
  | "navTitle"
  | "sectionTitle"
  | "cardTitle"
  | "metricValueLg"
  | "metricValueMd"
  | "body"
  | "caption"
  | "chip"
  | "button"
  | "buttonSecondary";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

const VARIANT_CONFIG: Record<
  TextVariant,
  { baseSize: BaseSize; fontWeight: TextProps["style"]; className: string }
> = {
  navTitle: {
    baseSize: "lg",
    fontWeight: { fontWeight: "700" },
    className: "text-neutral-900",
  },
  sectionTitle: {
    baseSize: "sm",
    fontWeight: { fontWeight: "600" },
    className: "text-neutral-500",
  },
  cardTitle: {
    baseSize: "sm",
    fontWeight: { fontWeight: "600" },
    className: "text-neutral-900",
  },
  metricValueLg: {
    baseSize: "2xl",
    fontWeight: { fontWeight: "700" },
    className: "text-neutral-900",
  },
  metricValueMd: {
    baseSize: "xl",
    fontWeight: { fontWeight: "700" },
    className: "text-neutral-900",
  },
  body: {
    baseSize: "sm",
    fontWeight: { fontWeight: "400" },
    className: "text-neutral-700",
  },
  caption: {
    baseSize: "xs",
    fontWeight: { fontWeight: "400" },
    className: "text-neutral-500",
  },
  chip: {
    baseSize: "xs",
    fontWeight: { fontWeight: "500" },
    className: "text-neutral-700",
  },
  button: {
    baseSize: "xs",
    fontWeight: { fontWeight: "600" },
    className: "text-white",
  },
  buttonSecondary: {
    baseSize: "xs",
    fontWeight: { fontWeight: "600" },
    className: "text-primary-500",
  },
};

export function AppText({
  variant = "body",
  style,
  className,
  ...props
}: AppTextProps) {
  const { scaledStyle } = useTextSize();
  const config = VARIANT_CONFIG[variant];

  return (
    <Text
      className={`${config.className}${className ? ` ${className}` : ""}`}
      style={[scaledStyle(config.baseSize), config.fontWeight, style]}
      {...props}
    />
  );
}
