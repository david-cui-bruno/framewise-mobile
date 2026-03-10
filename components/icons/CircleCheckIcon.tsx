import Svg, { Path, Circle } from "react-native-svg";

interface CircleCheckIconProps {
  checked?: boolean;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
}

export function CircleCheckIcon({
  checked = false,
  size = 24,
  checkedColor = "#1D61E7",
  uncheckedColor = "#D1D5DB",
}: CircleCheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={checked ? checkedColor : uncheckedColor}
        strokeWidth={2}
      />
      {checked && (
        <Path
          d="M8 12l3 3 5-5"
          stroke={checkedColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}
