import Svg, { Path } from "react-native-svg";

interface FramewiseMarkProps {
  color?: string;
  width?: number;
  height?: number;
}

export function FramewiseMark({ color = "#FFFFFF", width = 28, height = 34 }: FramewiseMarkProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 77" fill="none">
      <Path d="M4 24.5V4h20.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 52.5V24.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M60 24.5V4H39.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M24.5 73H4V52.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M39.5 73H60V52.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M60 52.5V24.5" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
