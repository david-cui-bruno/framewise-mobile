import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { isDemoMode, startDemo } from "@/lib/demo";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { FramewiseMark } from "@/components/icons/FramewiseMark";
import { colors } from "@/constants/colors";
import Svg, { Path, Circle } from "react-native-svg";

export default function LoginScreen() {
  const router = useRouter();
  const { refreshSession } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendLink = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email: trimmed });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/verify");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    setErrorMessage(null);

    try {
      await startDemo();
      await refreshSession();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Demo login failed.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <BlueGradient className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Logo */}
        <View className="items-center mt-16 mb-6">
          <View className="flex-row items-center gap-3">
            <FramewiseMark width={48} height={58} />
            <View>
              <Text className="text-white text-xl font-bold">Framewise</Text>
              <Text className="text-white text-xl font-bold">Health</Text>
            </View>
          </View>
        </View>

        {/* Login Card */}
        <View className="flex-1 justify-center px-4">
          <View className="bg-white rounded-control p-6">
            <View className="items-center mb-6">
              <Text className="text-3xl font-bold text-neutral-900 tracking-tight">
                Login
              </Text>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-neutral-500 mb-0.5">
                Email
              </Text>
              <View className="border border-neutral-100 rounded-[10px] bg-white px-3.5 h-12 justify-center">
                <TextInput
                  className="text-sm font-medium text-neutral-900"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !isDemoLoading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-xs font-medium text-neutral-500 mb-0.5">
                Password
              </Text>
              <View className="flex-row items-center border border-neutral-100 rounded-[10px] bg-white px-3.5 h-12">
                <TextInput
                  className="flex-1 text-sm font-medium text-neutral-900"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showPassword}
                  editable={!isLoading && !isDemoLoading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  <EyeOffIcon visible={showPassword} />
                </Pressable>
              </View>
            </View>

            {/* Remember Me / Forgot Password */}
            <View className="flex-row items-center justify-between mb-6">
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center gap-1.5"
              >
                <View
                  className={`w-[19px] h-[19px] rounded-[3px] border-2 items-center justify-center ${
                    rememberMe
                      ? "bg-primary-500 border-primary-500"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {rememberMe && (
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17l-5-5"
                        stroke="#FFFFFF"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </View>
                <Text className="text-xs font-medium text-neutral-500">
                  Remember me
                </Text>
              </Pressable>

              <Pressable>
                <Text className="text-xs font-semibold text-primary-500">
                  Forgot Password ?
                </Text>
              </Pressable>
            </View>

            {/* Error message */}
            {errorMessage && (
              <Text className="text-error-500 text-center text-sm mb-3">
                {errorMessage}
              </Text>
            )}

            {/* Log In Button */}
            <PrimaryButton
              label="Log In"
              onPress={handleSendLink}
              disabled={!email.trim() || isDemoLoading}
              isLoading={isLoading}
              className="mb-6"
            />

            {/* Demo button */}
            {isDemoMode && (
              <>
                <View className="flex-row items-center mb-6">
                  <View className="flex-1 h-px bg-neutral-100" />
                  <Text className="px-4 text-xs text-neutral-500">Or</Text>
                  <View className="flex-1 h-px bg-neutral-100" />
                </View>

                <Pressable
                  onPress={handleDemo}
                  disabled={isLoading || isDemoLoading}
                  className="flex-row items-center justify-center h-12 bg-white border border-neutral-100 rounded-[10px] gap-2.5"
                >
                  <Text className="text-sm font-semibold text-neutral-900">
                    {isDemoLoading ? "Starting demo..." : "Try Demo"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </BlueGradient>
  );
}

function EyeOffIcon({ visible }: { visible: boolean }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            stroke={colors.iconMuted}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx={12}
            cy={12}
            r={3}
            stroke={colors.iconMuted}
            strokeWidth={2}
          />
        </>
      ) : (
        <>
          <Path
            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
            stroke={colors.iconMuted}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M1 1l22 22"
            stroke={colors.iconMuted}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
}
