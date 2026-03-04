import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <View className="items-center py-12 px-4">
      <View className="w-16 h-16 rounded-full bg-error-100 items-center justify-center mb-4">
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            stroke={colors.danger}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </Svg>
      </View>
      <Text className="text-lg font-semibold text-neutral-900 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-neutral-600 mb-6 text-center max-w-sm">
        {message}
      </Text>
      {onRetry && (
        <PrimaryButton label="Try Again" onPress={onRetry} fullWidth={false} />
      )}
    </View>
  );
}
