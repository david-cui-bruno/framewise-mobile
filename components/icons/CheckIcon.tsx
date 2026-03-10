import Svg, { Path } from "react-native-svg";

interface CheckIconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function CheckIcon({ color = "#FFFFFF", size = 24, strokeWidth = 2 }: CheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
