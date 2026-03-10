import Svg, { Path } from "react-native-svg";

interface HeartPulseIconProps {
  color?: string;
  size?: number;
}

export function HeartPulseIcon({ color = "#E53E3E", size = 20 }: HeartPulseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 12h5l2-3 3 6 2-3h5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
