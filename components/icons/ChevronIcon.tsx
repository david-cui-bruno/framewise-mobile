import Svg, { Path } from "react-native-svg";

interface ChevronIconProps {
  direction?: "left" | "right" | "up" | "down";
  color?: string;
  size?: number;
}

const PATHS: Record<string, string> = {
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
};

export function ChevronIcon({ direction = "right", color = "#FFFFFF", size = 24 }: ChevronIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={PATHS[direction]}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
