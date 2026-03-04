import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { AVATARS } from "@/components/avatar/AvatarSelector";
import { supabase } from "@/lib/supabase";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SettingsSection } from "@/components/profile/SettingsSection";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { CareTeamCard } from "@/components/profile/CareTeamCard";
import { EmergencyContactCard } from "@/components/profile/EmergencyContactCard";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

interface CareAssignment {
  start_date: string;
  care_pathways: {
    name: string;
    duration_days: number;
  };
}

interface Physician {
  name: string;
  specialty: string | null;
  practice_name: string | null;
  practice_phone: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

const TEXT_SIZE_LABELS: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  extra_large: "Extra Large",
};

const PLAYBACK_SPEED_LABELS: Record<number, string> = {
  0.5: "0.5x",
  0.75: "0.75x",
  1.0: "1.0x",
  1.25: "1.25x",
  1.5: "1.5x",
  2.0: "2.0x",
};

export default function ProfileScreen() {
  const { patient, signOut } = useAuthContext();
  const router = useRouter();
  const [assignment, setAssignment] = useState<CareAssignment | null>(null);
  const [physician, setPhysician] = useState<Physician | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);

  const fetchData = useCallback(async () => {
    if (!patient) return;

    // Fetch care assignment and physician in one query
    const { data: assignmentData } = await supabase
      .from("patient_care_assignments")
      .select("start_date, care_pathways(name, duration_days), physicians(name, specialty, practice_name, practice_phone)")
      .eq("patient_id", patient.id)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    setAssignment(assignmentData as CareAssignment | null);
    setPhysician(
      (assignmentData as any)?.physicians as Physician | null
    );

    // Fetch emergency contacts
    const { data: contactsData } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("patient_id", patient.id)
      .order("is_primary", { ascending: false });

    setEmergencyContacts((contactsData as EmergencyContact[]) ?? []);
  }, [patient]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const avatarEmoji =
    AVATARS.find((a) => a.id === patient?.avatar_id)?.emoji ?? "👤";
  const displayName = patient?.display_name || "Patient";

  let currentDay = 1;
  const totalDays = assignment?.care_pathways?.duration_days ?? 0;
  if (assignment?.start_date) {
    const start = new Date(assignment.start_date);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    currentDay = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const handleDeleteContact = async (contactId: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", contactId);
    if (error) {
      console.error("Error deleting contact:", error);
      return;
    }
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="px-4 py-3">
        <Text className="text-lg font-semibold text-neutral-900 text-center">
          Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Avatar + Name */}
        <View className="items-center pt-4 pb-6">
          <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center mb-4">
            <Text className="text-5xl">{avatarEmoji}</Text>
          </View>
          <Text className="text-2xl font-bold text-neutral-900">
            {displayName}
          </Text>
          {patient?.email && (
            <Text className="text-base text-neutral-500 mt-1">
              {patient.email}
            </Text>
          )}
        </View>

        {/* Care Pathway Info */}
        {assignment && (
          <View className="mx-4 bg-neutral-0 rounded-2xl p-5 mb-4">
            <Text className="text-sm font-medium text-neutral-500 mb-1">
              Care Pathway
            </Text>
            <Text className="text-lg font-semibold text-neutral-900">
              {assignment.care_pathways.name}
            </Text>
            {totalDays > 0 && (
              <Text className="text-sm text-neutral-600 mt-1">
                Day {Math.min(currentDay, totalDays)} of {totalDays}
              </Text>
            )}
          </View>
        )}

        {/* Care Team */}
        <SettingsSection title="Care Team">
          <CareTeamCard physician={physician} />
        </SettingsSection>

        {/* Emergency Contacts */}
        <View className="mx-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-medium text-neutral-500">
              Emergency Contacts
            </Text>
            <Pressable
              onPress={() =>
                router.push("/profile/emergency-contacts" as any)
              }
              className="flex-row items-center gap-1"
            >
              <PlusIcon />
              <Text className="text-sm font-medium text-primary-600">
                Manage
              </Text>
            </Pressable>
          </View>

          {emergencyContacts.length === 0 ? (
            <View className="bg-neutral-0 rounded-2xl p-5 items-center">
              <Text className="text-neutral-500 text-sm">
                No emergency contacts added yet.
              </Text>
            </View>
          ) : (
            emergencyContacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onEdit={(id) =>
                  router.push(`/profile/emergency-contacts?editId=${id}` as any)
                }
                onDelete={handleDeleteContact}
              />
            ))
          )}
        </View>

        {/* Accessibility */}
        <SettingsSection title="Accessibility">
          <SettingsRow
            label="Text Size"
            value={TEXT_SIZE_LABELS[patient?.text_size ?? "medium"]}
          />
          <SettingsRow
            label="Playback Speed"
            value={
              PLAYBACK_SPEED_LABELS[patient?.playback_speed ?? 1.0] ?? "1.0x"
            }
            isLast
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsRow
            label="Notification Preferences"
            onPress={() =>
              router.push("/profile/notifications" as any)
            }
            isLast
          />
        </SettingsSection>

        {/* Sign Out */}
        <View className="mx-4 mt-4">
          <Pressable
            onPress={handleSignOut}
            className="bg-error-50 rounded-2xl py-4 items-center"
          >
            <Text className="text-base font-semibold text-error-600">
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlusIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4v16m8-8H4"
        stroke={colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
