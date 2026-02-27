import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface Patient {
  id: string;
  email: string;
  display_name: string | null;
  avatar_id: string;
  onboarding_completed: boolean;
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
      const { data } = await supabase
        .from("patients")
        .select("*")
        .eq("id", userId)
        .single();
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
    // Initial session check
    refreshSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const patient = await fetchPatient(session.user.id);
        setState({ user: session.user, patient, isLoading: false });
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, patient: null, isLoading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPatient, refreshSession]);

  return {
    user: state.user,
    patient: state.patient,
    isLoading: state.isLoading,
    signOut,
    refreshSession,
  };
}
