import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";
import { colors } from "@/constants/colors";

interface AdherenceRecord {
  id: string;
  medication_schedule_id: string;
  medication_name: string;
  status: "pending" | "taken" | "skipped" | "flagged";
}

interface MedicationAdherenceListProps {
  records: AdherenceRecord[];
  onToggle: (medicationScheduleId: string, status: "taken" | "skipped" | "flagged") => void;
}

export function MedicationAdherenceList({
  records,
  onToggle,
}: MedicationAdherenceListProps) {
  if (records.length === 0) return null;

  return (
    <View
      className="bg-neutral-0 rounded-2xl p-5 mb-4"
      style={getShadow("sm")}
    >
      <Text className="text-base font-semibold text-neutral-900 mb-3">
        Medication Adherence
      </Text>

      {records.map((record, index) => {
        const isLast = index === records.length - 1;

        return (
          <View
            key={record.medication_schedule_id}
            className={`flex-row items-center justify-between py-3 ${
              !isLast ? "border-b border-neutral-100" : ""
            }`}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <PillIcon />
              <Text className="text-sm font-medium text-neutral-900">
                {record.medication_name}
              </Text>
            </View>

            <View className="flex-row gap-1">
              <StatusButton
                label="Taken"
                isActive={record.status === "taken"}
                variant="success"
                onPress={() => onToggle(record.medication_schedule_id, "taken")}
              />
              <StatusButton
                label="Skip"
                isActive={record.status === "skipped"}
                variant="warning"
                onPress={() => onToggle(record.medication_schedule_id, "skipped")}
              />
              <StatusButton
                label="Issue"
                isActive={record.status === "flagged"}
                variant="error"
                onPress={() => onToggle(record.medication_schedule_id, "flagged")}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

interface StatusButtonProps {
  label: string;
  isActive: boolean;
  variant: "success" | "warning" | "error";
  onPress: () => void;
}

const VARIANT_STYLES = {
  success: { active: "bg-success-500", text: "text-white", inactive: "bg-success-50", inactiveText: "text-success-700" },
  warning: { active: "bg-warning-500", text: "text-white", inactive: "bg-warning-50", inactiveText: "text-warning-600" },
  error: { active: "bg-error-500", text: "text-white", inactive: "bg-error-50", inactiveText: "text-error-600" },
};

function StatusButton({ label, isActive, variant, onPress }: StatusButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Pressable
      onPress={onPress}
      className={`px-2.5 py-1 rounded-full ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          isActive ? styles.text : styles.inactiveText
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PillIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
