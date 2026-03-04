import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmergencyContactCard({
  contact,
  onEdit,
  onDelete,
}: EmergencyContactCardProps) {
  return (
    <View className="bg-neutral-0 rounded-2xl p-4 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-base font-semibold text-neutral-900">
              {contact.name}
            </Text>
            {contact.is_primary && (
              <View className="bg-primary-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-medium text-primary-700">
                  Primary
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-neutral-500 mb-1">
            {contact.relationship}
          </Text>
          <Text className="text-sm text-neutral-600">{contact.phone}</Text>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => onEdit(contact.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${contact.name}`}
            className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
          >
            <EditIcon />
          </Pressable>
          <Pressable
            onPress={() => onDelete(contact.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${contact.name}`}
            className="w-10 h-10 rounded-full bg-error-50 items-center justify-center"
          >
            <TrashIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function EditIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        stroke={colors.iconDefault}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        stroke={colors.danger}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
