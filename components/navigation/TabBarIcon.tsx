import Svg, { Path, Circle } from "react-native-svg";

interface TabBarIconProps {
  name: "home" | "diary" | "profile";
  color: string;
  size?: number;
}

export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "home" && (
        <Path
          d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "diary" && (
        <Path
          d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "profile" && (
        <>
          <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
          <Path
            d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}
