import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function VerifyPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 justify-center items-center px-6">
        {/* Icon */}
        <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center mb-6">
          <Text className="text-4xl">📧</Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-neutral-900 mb-3 text-center">
          Check your email
        </Text>

        {/* Description */}
        <Text className="text-neutral-600 text-center mb-8">
          We've sent you a magic link.{"\n"}
          Click the link in the email to sign in.
        </Text>

        {/* Back button */}
        <Pressable
          className="border border-neutral-300 rounded-full px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-neutral-700 font-medium">
            Back to login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
