import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

// expo-secure-store has a 2048-byte limit per value.
// Supabase sessions (with JWTs) can exceed this, so we use AsyncStorage
// as a fallback for large values while keeping SecureStore for small ones.
const SECURE_STORE_LIMIT = 2048;

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      // Try SecureStore first, then fall back to AsyncStorage
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue) return secureValue;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (value.length > SECURE_STORE_LIMIT) {
        // Value too large for SecureStore — use AsyncStorage
        await AsyncStorage.setItem(key, value);
        // Clean up any stale SecureStore entry
        await SecureStore.deleteItemAsync(key).catch(() => {});
      } else {
        await SecureStore.setItemAsync(key, value);
        // Clean up any stale AsyncStorage entry
        await AsyncStorage.removeItem(key).catch(() => {});
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
