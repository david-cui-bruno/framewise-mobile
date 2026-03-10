import { type ReactNode } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BlueGradientProps {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function BlueGradient({ children, className = "", style }: BlueGradientProps) {
  return (
    <LinearGradient
      colors={["#1D61E7", "rgba(124,184,247,0.88)", "#D6E9FD"]}
      locations={[0, 0.33, 0.84]}
      className={className}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
