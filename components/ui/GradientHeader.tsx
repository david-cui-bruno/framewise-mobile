import { type ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";

interface GradientHeaderProps {
  children: ReactNode;
  className?: string;
}

export function GradientHeader({ children, className = "" }: GradientHeaderProps) {
  return (
    <LinearGradient
      colors={[colors.skyGradientStart, colors.skyGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={className}
    >
      {children}
    </LinearGradient>
  );
}
