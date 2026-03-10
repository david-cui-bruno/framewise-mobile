import Svg, { Path, Circle } from "react-native-svg";

interface PlayIconProps {
  color?: string;
  size?: number;
}

export function PlayIcon({ color = "#FFFFFF", size = 66 }: PlayIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 66 66" fill="none">
      <Circle cx={33} cy={33} r={30} fill="rgba(255,255,255,0.25)" />
      <Path d="M27 21l18 12-18 12z" fill={color} />
    </Svg>
  );
}
