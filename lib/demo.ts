import { supabase } from "@/lib/supabase";

/**
 * Whether the app is running in demo mode.
 * Controlled by EXPO_PUBLIC_DEMO_MODE env var at build time.
 */
export const isDemoMode = process.env.EXPO_PUBLIC_DEMO_MODE === "true";

const DEMO_EMAIL = "demo@framewise.health";
const DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEMO_PASSWORD ?? "";

/**
 * Sign in as the demo user and reset all their activity data.
 * The caller must call refreshSession() after awaiting this
 * to pick up the reset patient state.
 */
export async function startDemo(): Promise<void> {
  if (!isDemoMode) {
    throw new Error("Demo mode is not enabled");
  }

  if (!DEMO_PASSWORD) {
    throw new Error("EXPO_PUBLIC_DEMO_PASSWORD is not set");
  }

  // Step 1: Sign in with the demo account
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (signInError) {
    throw new Error(`Demo sign-in failed: ${signInError.message}`);
  }

  // Step 2: Atomically reset all patient data via server-side RPC
  const { error: resetError } = await supabase.rpc("reset_demo_patient");

  if (resetError) {
    // Sign out to avoid partial state
    await supabase.auth.signOut();
    throw new Error(`Demo reset failed: ${resetError.message}`);
  }
}
