import { View } from "react-native";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isActive = i + 1 === currentStep;
        return (
          <View
            key={i}
            className={
              isActive
                ? "w-3 h-3 rounded-full bg-primary-500"
                : "w-2 h-2 rounded-full bg-neutral-200"
            }
          />
        );
      })}
    </View>
  );
}
