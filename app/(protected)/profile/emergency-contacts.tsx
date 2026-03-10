import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmergencyContactCard } from "@/components/profile/EmergencyContactCard";
import { colors } from "@/constants/colors";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { ChevronIcon } from "@/components/icons/ChevronIcon";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

interface ContactForm {
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

const RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Other",
];

const emptyForm: ContactForm = {
  name: "",
  relationship: "Spouse",
  phone: "",
  is_primary: false,
};

export default function EmergencyContactsScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>(emptyForm);

  const fetchContacts = useCallback(async () => {
    if (!patient) return;
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("patient_id", patient.id)
      .order("is_primary", { ascending: false });
    setContacts((data as EmergencyContact[]) ?? []);
  }, [patient]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSave = async () => {
    if (!patient) return;
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert("Missing Info", "Name and phone number are required.");
      return;
    }

    if (editingId) {
      await supabase
        .from("emergency_contacts")
        .update({
          name: form.name.trim(),
          relationship: form.relationship,
          phone: form.phone.trim(),
          is_primary: form.is_primary,
        })
        .eq("id", editingId);
    } else {
      await supabase.from("emergency_contacts").insert({
        patient_id: patient.id,
        name: form.name.trim(),
        relationship: form.relationship,
        phone: form.phone.trim(),
        is_primary: form.is_primary,
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchContacts();
  };

  const handleEdit = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;
    setForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      is_primary: contact.is_primary,
    });
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await supabase.from("emergency_contacts").delete().eq("id", id);
            fetchContacts();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-neutral-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Gradient Header */}
          <BlueGradient className="pt-14 pb-3">
            <View className="flex-row items-center h-12 px-1">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 items-center justify-center"
              >
                <ChevronIcon direction="left" />
              </Pressable>
              <View className="flex-1 items-center mr-10">
                <Text className="text-base font-semibold text-white">
                  Emergency Contacts
                </Text>
              </View>
            </View>
          </BlueGradient>

          {/* Contact List */}
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            renderItem={({ item }) => (
              <EmergencyContactCard
                contact={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            ListEmptyComponent={
              <View className="items-center py-12">
                <Text className="text-neutral-500 text-sm">
                  No emergency contacts added yet.
                </Text>
              </View>
            }
            ListFooterComponent={
              !showForm ? (
                <Pressable
                  onPress={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                    setShowForm(true);
                  }}
                  className="bg-primary-500 rounded-2xl py-4 items-center mt-2"
                >
                  <Text className="text-white font-semibold text-base">
                    Add Contact
                  </Text>
                </Pressable>
              ) : null
            }
          />

          {/* Add/Edit Form */}
          {showForm && (
            <View className="bg-neutral-0 border-t border-neutral-200 px-4 pt-4 pb-6">
              <Text className="text-base font-semibold text-neutral-900 mb-4">
                {editingId ? "Edit Contact" : "New Contact"}
              </Text>

              {/* Name */}
              <Text className="text-sm font-medium text-neutral-600 mb-1">
                Name
              </Text>
              <TextInput
                value={form.name}
                onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                placeholder="Full name"
                className="bg-neutral-50 rounded-xl px-4 py-3 text-base text-neutral-900 mb-3"
                placeholderTextColor={colors.placeholder}
              />

              {/* Relationship */}
              <Text className="text-sm font-medium text-neutral-600 mb-1">
                Relationship
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {RELATIONSHIPS.map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setForm((f) => ({ ...f, relationship: r }))}
                    className={`px-4 py-2 rounded-full ${
                      form.relationship === r
                        ? "bg-primary-500"
                        : "bg-neutral-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        form.relationship === r
                          ? "text-white"
                          : "text-neutral-700"
                      }`}
                    >
                      {r}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Phone */}
              <Text className="text-sm font-medium text-neutral-600 mb-1">
                Phone Number
              </Text>
              <TextInput
                value={form.phone}
                onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                placeholder="(555) 123-4567"
                keyboardType="phone-pad"
                className="bg-neutral-50 rounded-xl px-4 py-3 text-base text-neutral-900 mb-3"
                placeholderTextColor={colors.placeholder}
              />

              {/* Primary Toggle */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-medium text-neutral-600">
                  Primary Contact
                </Text>
                <Switch
                  value={form.is_primary}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, is_primary: v }))
                  }
                  trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                  thumbColor={colors.switchThumb}
                />
              </View>

              {/* Actions */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleCancel}
                  className="flex-1 bg-neutral-100 rounded-xl py-3 items-center"
                >
                  <Text className="text-base font-semibold text-neutral-700">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  className="flex-1 bg-primary-500 rounded-xl py-3 items-center"
                >
                  <Text className="text-base font-semibold text-white">
                    {editingId ? "Update" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

