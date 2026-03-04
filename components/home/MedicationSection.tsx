import { View, Text } from "react-native";
import { MedicationCard } from "@/components/home/MedicationCard";

interface MedicationSchedule {
  id: string;
  medication_name: string;
  dosage: string | null;
  instructions: string | null;
  time_of_day: string;
  linked_video_id: string | null;
}

interface MedicationSectionProps {
  medications: MedicationSchedule[];
  onVideoPress: (videoId: string) => void;
}

const TIME_LABELS: Record<string, { label: string; icon: string }> = {
  morning: { label: "Morning", icon: "sunrise" },
  afternoon: { label: "Afternoon", icon: "sun" },
  evening: { label: "Evening", icon: "moon" },
};

export function MedicationSection({
  medications,
  onVideoPress,
}: MedicationSectionProps) {
  if (medications.length === 0) return null;

  const grouped = medications.reduce<Record<string, MedicationSchedule[]>>(
    (acc, med) => {
      const key = med.time_of_day;
      if (!acc[key]) acc[key] = [];
      acc[key].push(med);
      return acc;
    },
    {}
  );

  const timeOrder = ["morning", "afternoon", "evening"];

  return (
    <View className="mb-4">
      <Text className="text-lg font-bold text-neutral-900 mb-3">
        Medications
      </Text>

      {timeOrder.map((time) => {
        const meds = grouped[time];
        if (!meds || meds.length === 0) return null;

        const timeInfo = TIME_LABELS[time] ?? { label: time, icon: "" };

        return (
          <View key={time} className="mb-3">
            <Text className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wide">
              {timeInfo.label}
            </Text>
            {meds.map((med) => (
              <MedicationCard
                key={med.id}
                medicationName={med.medication_name}
                dosage={med.dosage}
                instructions={med.instructions}
                linkedVideoId={med.linked_video_id}
                onVideoPress={onVideoPress}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}
