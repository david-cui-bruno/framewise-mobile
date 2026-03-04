import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface Patient {
  id: string;
  email: string;
  display_name: string | null;
  avatar_id: string;
  onboarding_completed: boolean;
  preferred_language: string;
  text_size: "small" | "medium" | "large" | "extra_large";
  playback_speed: number;
}

interface AuthState {
  user: User | null;
  patient: Patient | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    patient: null,
    isLoading: true,
  });

  const fetchPatient = useCallback(
    async (userId: string): Promise<Patient | null> => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error fetching patient:", error);
      }
      return data;
    },
    []
  );

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const patient = await fetchPatient(user.id);
      setState({ user, patient, isLoading: false });
    } else {
      setState({ user: null, patient: null, isLoading: false });
    }
  }, [fetchPatient]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, patient: null, isLoading: false });
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Initial session check
    const initSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (user) {
          const patient = await fetchPatient(user.id);
          if (isMounted) {
            setState({ user, patient, isLoading: false });
          }
        } else {
          setState({ user: null, patient: null, isLoading: false });
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        if (isMounted) {
          setState({ user: null, patient: null, isLoading: false });
        }
      }
    };

    initSession();

    // Listen for auth changes (skips INITIAL_SESSION to avoid duplicate fetch)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") return;

      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
        const patient = await fetchPatient(session.user.id);
        if (isMounted) {
          setState({ user: session.user, patient, isLoading: false });
        }
      } else if (event === "SIGNED_OUT") {
        if (isMounted) {
          setState({ user: null, patient: null, isLoading: false });
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchPatient]);

  return {
    user: state.user,
    patient: state.patient,
    isLoading: state.isLoading,
    signOut,
    refreshSession,
  };
}
