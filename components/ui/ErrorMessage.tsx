import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";

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
      <View className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30 items-center justify-center mb-4">
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            stroke="#DC2626"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </Svg>
      </View>
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-0 mb-2 text-center">
        {title}
      </Text>
      <Text className="text-neutral-600 dark:text-neutral-300 mb-6 text-center max-w-sm">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="px-6 py-3 bg-primary-500 dark:bg-primary-400 rounded-full"
        >
          <Text className="text-white dark:text-neutral-900 font-medium">
            Try Again
          </Text>
        </Pressable>
      )}
    </View>
  );
}
