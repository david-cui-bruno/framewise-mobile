import { View } from "react-native";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-3 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isActive = i + 1 === currentStep;
        return (
          <View
            key={i}
            className={
              isActive
                ? "w-2.5 h-2.5 rounded-full bg-white"
                : "w-1.5 h-1.5 rounded-full bg-white/40"
            }
          />
        );
      })}
    </View>
  );
}
