import Svg, { Path } from "react-native-svg";

interface WeightIconProps {
  color?: string;
  size?: number;
}

export function WeightIcon({ color = "#F4A340", size = 20 }: WeightIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a4 4 0 014 4h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2a4 4 0 014-4z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
