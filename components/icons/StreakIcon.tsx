import Svg, { Path } from "react-native-svg";

interface StreakIconProps {
  color?: string;
  size?: number;
}

export function StreakIcon({ color = "#FFFFFF", size = 20 }: StreakIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
