import Svg, { Path } from "react-native-svg";

interface PlusIconProps {
  color?: string;
  size?: number;
}

export function PlusIcon({ color = "#6B7280", size = 18 }: PlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
